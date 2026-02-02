"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { TokenUsage, fetchUsageByDateRange } from "@/lib/supabase";

// Pricing per 1M tokens
const PRICING = {
  anthropic: {
    input: 15.0,
    output: 75.0,
    cacheRead: 0.3,
    cacheWrite: 3.75,
  },
  moonshot: {
    input: 0.6,
    output: 3.0,
    cacheRead: 0.1,
    cacheWrite: 0.6,
  },
};

interface UsageStats {
  totalInput: number;
  totalOutput: number;
  totalCacheRead: number;
  totalCacheWrite: number;
  totalTokens: number;
  totalCost: number;
  byProvider: Record<string, {
    input: number;
    output: number;
    cacheRead: number;
    cacheWrite: number;
    tokens: number;
    cost: number;
    models: Record<string, { input: number; output: number; cacheRead: number; cacheWrite: number; tokens: number; cost: number }>;
  }>;
}

function calculateStats(records: TokenUsage[]): UsageStats {
  const stats: UsageStats = {
    totalInput: 0,
    totalOutput: 0,
    totalCacheRead: 0,
    totalCacheWrite: 0,
    totalTokens: 0,
    totalCost: 0,
    byProvider: {},
  };

  for (const record of records) {
    stats.totalInput += record.input_tokens;
    stats.totalOutput += record.output_tokens;
    stats.totalCacheRead += record.cache_read_tokens || 0;
    stats.totalCacheWrite += record.cache_write_tokens || 0;
    stats.totalTokens += record.total_tokens;
    stats.totalCost += record.cost_usd;

    const provider = record.provider.toLowerCase();
    if (!stats.byProvider[provider]) {
      stats.byProvider[provider] = {
        input: 0,
        output: 0,
        cacheRead: 0,
        cacheWrite: 0,
        tokens: 0,
        cost: 0,
        models: {},
      };
    }

    const providerStats = stats.byProvider[provider];
    providerStats.input += record.input_tokens;
    providerStats.output += record.output_tokens;
    providerStats.cacheRead += record.cache_read_tokens || 0;
    providerStats.cacheWrite += record.cache_write_tokens || 0;
    providerStats.tokens += record.total_tokens;
    providerStats.cost += record.cost_usd;

    if (!providerStats.models[record.model]) {
      providerStats.models[record.model] = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, tokens: 0, cost: 0 };
    }
    providerStats.models[record.model].input += record.input_tokens;
    providerStats.models[record.model].output += record.output_tokens;
    providerStats.models[record.model].cacheRead += record.cache_read_tokens || 0;
    providerStats.models[record.model].cacheWrite += record.cache_write_tokens || 0;
    providerStats.models[record.model].tokens += record.total_tokens;
    providerStats.models[record.model].cost += record.cost_usd;
  }

  return stats;
}

function formatNumber(num: number): string {
  return num.toLocaleString();
}

function formatCost(cost: number): string {
  if (cost === 0) return "$0.00";
  if (cost < 0.01) return `$${cost.toFixed(4)}`;
  if (cost < 1) return `$${cost.toFixed(3)}`;
  return `$${cost.toFixed(2)}`;
}

function getProviderColor(provider: string): string {
  const p = provider.toLowerCase();
  if (p === "anthropic") return "#7cb88a";
  if (p === "moonshot" || p.includes("kimi")) return "#a0a0d0";
  return "#888";
}

function getProviderDisplayName(provider: string): string {
  const p = provider.toLowerCase();
  if (p === "anthropic") return "Anthropic";
  if (p === "moonshot" || p.includes("kimi")) return "Moonshot / Kimi";
  return provider.charAt(0).toUpperCase() + provider.slice(1);
}

function getProviderPricing(provider: string): { input: number; output: number; cacheRead: number; cacheWrite: number } {
  const p = provider.toLowerCase();
  if (p.includes("anthropic")) return PRICING.anthropic;
  return PRICING.moonshot;
}

interface UsageCardProps {
  title: string;
  stats: UsageStats;
  isLoading: boolean;
}

function UsageCard({ title, stats, isLoading }: UsageCardProps) {
  const providers = Object.keys(stats.byProvider).sort();

  if (isLoading) {
    return (
      <div className="bg-surface rounded-xl p-6 border border-border">
        <h3 className="text-lg font-semibold text-text mb-4">{title}</h3>
        <div className="text-text-muted">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-xl p-6 border border-border">
      <h3 className="text-lg font-semibold text-text mb-4">{title}</h3>
      
      {/* Totals */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-surface-secondary rounded-lg p-3">
          <div className="text-xs text-text-muted mb-1">Input Tokens</div>
          <div className="text-xl font-semibold text-text">{formatNumber(stats.totalInput)}</div>
        </div>
        <div className="bg-surface-secondary rounded-lg p-3">
          <div className="text-xs text-text-muted mb-1">Output Tokens</div>
          <div className="text-xl font-semibold text-text">{formatNumber(stats.totalOutput)}</div>
        </div>
        <div className="bg-surface-secondary rounded-lg p-3">
          <div className="text-xs text-text-muted mb-1">Total Tokens</div>
          <div className="text-xl font-semibold text-text">{formatNumber(stats.totalTokens)}</div>
        </div>
      </div>

      {/* Cache Stats */}
      {(stats.totalCacheRead > 0 || stats.totalCacheWrite > 0) && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-surface-secondary rounded-lg p-3">
            <div className="text-xs text-text-muted mb-1">Cache Read</div>
            <div className="text-lg font-medium text-text">{formatNumber(stats.totalCacheRead)}</div>
          </div>
          <div className="bg-surface-secondary rounded-lg p-3">
            <div className="text-xs text-text-muted mb-1">Cache Write</div>
            <div className="text-lg font-medium text-text">{formatNumber(stats.totalCacheWrite)}</div>
          </div>
        </div>
      )}

      {/* Total Cost */}
      <div className="bg-accent/10 rounded-lg p-4 mb-6 border border-accent/20">
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-muted">Total Cost</span>
          <span className="text-2xl font-semibold text-accent-light">{formatCost(stats.totalCost)}</span>
        </div>
      </div>

      {/* Provider Breakdown */}
      {providers.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-text-muted uppercase tracking-wider">
            By Provider
          </h4>
          {providers.map((provider) => {
            const pStats = stats.byProvider[provider];
            const models = Object.keys(pStats.models).sort();
            const pricing = getProviderPricing(provider);
            
            // Calculate individual costs for this provider
            const inputCost = (pStats.input / 1_000_000) * pricing.input;
            const outputCost = (pStats.output / 1_000_000) * pricing.output;
            const cacheReadCost = (pStats.cacheRead / 1_000_000) * pricing.cacheRead;
            const cacheWriteCost = (pStats.cacheWrite / 1_000_000) * pricing.cacheWrite;
            const calculatedTotalCost = inputCost + outputCost + cacheReadCost + cacheWriteCost;
            
            return (
              <div key={provider} className="bg-surface-secondary rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getProviderColor(provider) }}
                  />
                  <span className="font-medium text-text">
                    {getProviderDisplayName(provider)}
                  </span>
                </div>
                
                {/* Token Breakdown with Costs */}
                <div className="space-y-2 mb-4">
                  {/* Input */}
                  <div className="flex items-center justify-between py-1 border-b border-border/50">
                    <div className="flex items-center gap-4 flex-1">
                      <span className="text-xs text-text-muted w-20">Input</span>
                      <span className="text-sm text-text">{formatNumber(pStats.input)}</span>
                    </div>
                    <span className="text-sm text-accent-light font-medium">{formatCost(inputCost)}</span>
                  </div>
                  
                  {/* Output */}
                  <div className="flex items-center justify-between py-1 border-b border-border/50">
                    <div className="flex items-center gap-4 flex-1">
                      <span className="text-xs text-text-muted w-20">Output</span>
                      <span className="text-sm text-text">{formatNumber(pStats.output)}</span>
                    </div>
                    <span className="text-sm text-accent-light font-medium">{formatCost(outputCost)}</span>
                  </div>
                  
                  {/* Cache Read */}
                  {(pStats.cacheRead > 0 || pStats.cacheWrite > 0) && (
                    <div className="flex items-center justify-between py-1 border-b border-border/50">
                      <div className="flex items-center gap-4 flex-1">
                        <span className="text-xs text-text-muted w-20">Cache Read</span>
                        <span className="text-sm text-text">{formatNumber(pStats.cacheRead)}</span>
                      </div>
                      <span className="text-sm text-accent-light font-medium">{formatCost(cacheReadCost)}</span>
                    </div>
                  )}
                  
                  {/* Cache Write */}
                  {(pStats.cacheRead > 0 || pStats.cacheWrite > 0) && (
                    <div className="flex items-center justify-between py-1 border-b border-border/50">
                      <div className="flex items-center gap-4 flex-1">
                        <span className="text-xs text-text-muted w-20">Cache Write</span>
                        <span className="text-sm text-text">{formatNumber(pStats.cacheWrite)}</span>
                      </div>
                      <span className="text-sm text-accent-light font-medium">{formatCost(cacheWriteCost)}</span>
                    </div>
                  )}
                  
                  {/* Total for this provider */}
                  <div className="flex items-center justify-between py-2 mt-2 bg-surface/50 rounded px-2">
                    <div className="flex items-center gap-4 flex-1">
                      <span className="text-xs font-medium text-text w-20">Total</span>
                      <span className="text-sm font-medium text-text">{formatNumber(pStats.tokens)}</span>
                    </div>
                    <span className="text-sm font-semibold text-accent-light">{formatCost(calculatedTotalCost)}</span>
                  </div>
                </div>

                {/* Models */}
                {models.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="text-xs text-text-muted mb-2">Models</div>
                    <div className="space-y-2">
                      {models.map((model) => {
                        const mStats = pStats.models[model];
                        // Calculate costs for this model
                        const mInputCost = (mStats.input / 1_000_000) * pricing.input;
                        const mOutputCost = (mStats.output / 1_000_000) * pricing.output;
                        const mCacheReadCost = (mStats.cacheRead / 1_000_000) * pricing.cacheRead;
                        const mCacheWriteCost = (mStats.cacheWrite / 1_000_000) * pricing.cacheWrite;
                        const mTotalCost = mInputCost + mOutputCost + mCacheReadCost + mCacheWriteCost;
                        
                        return (
                          <div key={model} className="flex items-center justify-between text-sm py-1">
                            <span className="text-text-muted truncate flex-1">{model}</span>
                            <span className="text-text mx-4">{formatNumber(mStats.tokens)}</span>
                            <span className="text-accent-light font-medium">{formatCost(mTotalCost)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {providers.length === 0 && (
        <div className="text-center py-8 text-text-muted">
          No usage data for this period
        </div>
      )}
    </div>
  );
}

export default function UsagePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [todayRecords, setTodayRecords] = useState<TokenUsage[]>([]);
  const [weekRecords, setWeekRecords] = useState<TokenUsage[]>([]);
  const [monthRecords, setMonthRecords] = useState<TokenUsage[]>([]);

  useEffect(() => {
    async function loadUsage() {
      try {
        setLoading(true);
        setError(null);

        const now = new Date();
        
        // Today (start of day to now)
        const todayStart = new Date(now);
        todayStart.setHours(0, 0, 0, 0);
        
        // Week (7 days ago to now)
        const weekStart = new Date(now);
        weekStart.setDate(weekStart.getDate() - 7);
        weekStart.setHours(0, 0, 0, 0);
        
        // Month (start of month to now)
        const monthStart = new Date(now);
        monthStart.setDate(1);
        monthStart.setHours(0, 0, 0, 0);

        const [today, week, month] = await Promise.all([
          fetchUsageByDateRange(todayStart.toISOString(), now.toISOString()),
          fetchUsageByDateRange(weekStart.toISOString(), now.toISOString()),
          fetchUsageByDateRange(monthStart.toISOString(), now.toISOString()),
        ]);

        setTodayRecords(today);
        setWeekRecords(week);
        setMonthRecords(month);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load usage data");
      } finally {
        setLoading(false);
      }
    }

    loadUsage();
  }, []);

  const todayStats = useMemo(() => calculateStats(todayRecords), [todayRecords]);
  const weekStats = useMemo(() => calculateStats(weekRecords), [weekRecords]);
  const monthStats = useMemo(() => calculateStats(monthRecords), [monthRecords]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header title="Token Usage" />
      
      <main className="flex flex-1 overflow-hidden" style={{ height: "calc(100vh - 73px)" }}>
        <Sidebar activeView="usage" />
        
        <section className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight text-text">
              Token Usage
            </h1>
            <p className="text-text-muted mt-1">
              Track API token consumption and costs across providers
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded-lg text-red-400">
              Error loading usage data: {error}
            </div>
          )}

          <div className="grid gap-6 max-w-4xl">
            <UsageCard title="Today" stats={todayStats} isLoading={loading} />
            <UsageCard title="This Week (7 days)" stats={weekStats} isLoading={loading} />
            <UsageCard title="This Month" stats={monthStats} isLoading={loading} />
          </div>
        </section>
      </main>
    </div>
  );
}
