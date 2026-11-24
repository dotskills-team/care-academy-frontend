import { getDashboardOverview } from "@/lib/admin/dashboard";
import PageHeader from "@/components/admin/dashboard/PageHeader";
import DateRangeTabs from "@/components/admin/dashboard/DateRangeTabs";
import StatCard from "@/components/admin/dashboard/StatCard";
import InquiryTrendChart from "@/components/admin/dashboard/InquiryTrendChart";
import StatusDonut from "@/components/admin/dashboard/StatusDonut";
import QuickActions from "@/components/admin/dashboard/QuickActions";
import RecentInquiries from "@/components/admin/dashboard/RecentInquiries";
import SideLists from "@/components/admin/dashboard/SideLists";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const data = await getDashboardOverview();

  return (
    <div className="space-y-5">
      <PageHeader lastUpdated={data.lastUpdated} />
      <DateRangeTabs />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.stats.map(({ key, ...stat }) => (
          <StatCard key={key} {...stat} />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.5fr_1fr_0.8fr]">
        <InquiryTrendChart points={data.trend} />
        <StatusDonut total={data.statusBreakdown.total} items={data.statusBreakdown.items} />
        <QuickActions actions={data.quickActions} />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <RecentInquiries rows={data.recentInquiries} />
        <SideLists
          contentUpdates={data.contentUpdates}
          deadlines={data.deadlines}
          activity={data.activity}
        />
      </section>
    </div>
  );
}
