"use client";

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useI18n } from "@/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StatisticsEntryWithRelations } from "@/types/domain";

export function DashboardChart({ entries }: { entries: StatisticsEntryWithRelations[] }) {
  const { dict } = useI18n();

  const byDate = new Map<string, { date: string; spent: number; return: number }>();
  for (const e of entries) {
    const key = e.period_start;
    const existing = byDate.get(key) ?? { date: key, spent: 0, return: 0 };
    existing.spent += e.amount_spent;
    existing.return += e.advertising_return;
    byDate.set(key, existing);
  }
  const data = Array.from(byDate.values()).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base text-foreground">{dict.dashboard.chartTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="spent"
                name={dict.statistics.amountSpent}
                stroke="#dc2626"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="return"
                name={dict.statistics.advertisingReturn}
                stroke="#1d4ed8"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
