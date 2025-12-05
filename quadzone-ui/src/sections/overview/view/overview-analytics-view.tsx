import { useEffect, useMemo, useState } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

import { DashboardContent } from "src/layouts/dashboard";
import { API } from "src/api/base";
import type { AdminDashboardAnalyticsResponse, MonthlyMetric } from "src/api/types";

import { AnalyticsNews } from "../analytics-news";
import { AnalyticsOrderTimeline } from "../analytics-order-timeline";
import { AnalyticsWidgetSummary } from "../analytics-widget-summary";

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
    const [data, setData] = useState<AdminDashboardAnalyticsResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        API.get<AdminDashboardAnalyticsResponse>("/admin/dashboard/analytics", { params: { months: 12 } })
            .then((res) => {
                if (mounted) {
                    setData(res.data);
                    setLoading(false);
                }
            })
            .catch(() => {
                if (mounted) {
                    setError("Failed to load analytics");
                    setLoading(false);
                }
            });
        return () => {
            mounted = false;
        };
    }, []);

    const categories = useMemo(() => {
        const src = data?.sales ?? [];
        return src.map((m: MonthlyMetric) => m.label);
    }, [data]);

    const salesSeries = useMemo(() => (data?.sales ?? []).map((m) => Number(m.value)), [data]);
    const usersSeries = useMemo(() => (data?.users ?? []).map((m) => Number(m.value)), [data]);
    const ordersSeries = useMemo(() => (data?.orders ?? []).map((m) => Number(m.value)), [data]);
    const messagesSeries = useMemo(() => (data?.messages ?? []).map((m) => Number(m.value)), [data]);

    const last = (arr: number[]) => (arr.length ? arr[arr.length - 1] : 0);
    const prev = (arr: number[]) => (arr.length > 1 ? arr[arr.length - 2] : 0);
    const pct = (arr: number[]) => {
        const a = last(arr);
        const b = prev(arr);
        if (b === 0) return a > 0 ? 100 : 0;
        return ((a - b) / b) * 100;
    };

    return (
        <DashboardContent maxWidth="xl">
            <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
                Hi, Welcome back 👋
            </Typography>

            {loading ? (
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12 }}>
                        <CircularProgress />
                    </Grid>
                </Grid>
            ) : (
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <AnalyticsWidgetSummary
                            title="Monthly sales"
                            percent={pct(salesSeries)}
                            total={last(salesSeries)}
                            icon={<img alt="Weekly sales" src="/assets/icons/glass/ic-glass-bag.svg" />}
                            chart={{ categories, series: salesSeries }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <AnalyticsWidgetSummary
                            title="Monthly new users"
                            percent={pct(usersSeries)}
                            total={last(usersSeries)}
                            color="secondary"
                            icon={<img alt="New users" src="/assets/icons/glass/ic-glass-users.svg" />}
                            chart={{ categories, series: usersSeries }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <AnalyticsWidgetSummary
                            title="Monthly purchase orders"
                            percent={pct(ordersSeries)}
                            total={last(ordersSeries)}
                            color="warning"
                            icon={<img alt="Purchase orders" src="/assets/icons/glass/ic-glass-buy.svg" />}
                            chart={{ categories, series: ordersSeries }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <AnalyticsWidgetSummary
                            title="Monthly messages"
                            percent={pct(messagesSeries)}
                            total={last(messagesSeries)}
                            color="error"
                            icon={<img alt="Messages" src="/assets/icons/glass/ic-glass-message.svg" />}
                            chart={{ categories, series: messagesSeries }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6, lg: 8 }}>
                        <AnalyticsNews title="News" list={[]} />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                        <AnalyticsOrderTimeline title="Order timeline" list={[]} />
                    </Grid>
                </Grid>
            )}

            {error && (
                <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                    {error}
                </Typography>
            )}
        </DashboardContent>
    );
}
