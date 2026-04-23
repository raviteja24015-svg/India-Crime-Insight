import React, { useState, useMemo } from "react";
import { generateData, CITIES, CRIME_TYPES, Incident } from "@/lib/data";
import { Shield, Search, RefreshCw, Filter, TrendingUp, Users, Target, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { motion } from "framer-motion";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function Dashboard() {
  const rawData = useMemo(() => generateData(1200), []);

  const [cityFilter, setCityFilter] = useState("All");
  const [monthFilter, setMonthFilter] = useState("All");
  const [crimeFilter, setCrimeFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  const filteredData = useMemo(() => {
    return rawData.filter(d => {
      const matchCity = cityFilter === "All" || d.city === cityFilter;
      const matchMonth = monthFilter === "All" || d.month === parseInt(monthFilter);
      const matchCrime = crimeFilter === "All" || d.crimeType === crimeFilter;
      const matchSearch = Object.values(d).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCity && matchMonth && matchCrime && matchSearch;
    });
  }, [rawData, cityFilter, monthFilter, crimeFilter, searchQuery]);

  const totalIncidents = filteredData.length;
  const percentClosed = totalIncidents ? Math.round((filteredData.filter(d => d.caseClosed).length / totalIncidents) * 100) : 0;
  const avgAge = totalIncidents ? Math.round(filteredData.reduce((acc, d) => acc + d.victimAge, 0) / totalIncidents) : 0;
  
  const cityCounts = filteredData.reduce((acc, d) => {
    acc[d.city] = (acc[d.city] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const mostAffectedCity = Object.entries(cityCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  const topCrimes = useMemo(() => {
    const counts = filteredData.reduce((acc, d) => {
      acc[d.crimeType] = (acc[d.crimeType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 10);
  }, [filteredData]);

  const weaponCounts = useMemo(() => {
    const counts = filteredData.reduce((acc, d) => {
      acc[d.weaponUsed] = (acc[d.weaponUsed] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [filteredData]);

  const domainCounts = useMemo(() => {
    const counts = filteredData.reduce((acc, d) => {
      acc[d.domain] = (acc[d.domain] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  const COLORS = ['#e11d48', '#f97316', '#eab308', '#64748b'];

  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(totalIncidents / itemsPerPage);

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-8 font-sans space-y-6">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-3 rounded-xl">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">India Crime Hotspot Analysis Dashboard</h1>
            <p className="text-muted-foreground text-sm font-medium tracking-widest uppercase mt-1">National Crime Intelligence Platform</p>
          </div>
        </div>
      </header>

      {/* Filters */}
      <Card className="bg-card/50 border-border">
        <CardContent className="p-4 flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1.5 w-full md:w-auto flex-1">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Target className="w-3 h-3" /> City
            </label>
            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Cities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Cities</SelectItem>
                {CITIES.map(city => <SelectItem key={city} value={city}>{city}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex flex-col gap-1.5 w-full md:w-auto flex-1">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Filter className="w-3 h-3" /> Month
            </label>
            <Select value={monthFilter} onValueChange={setMonthFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Months" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Months</SelectItem>
                {MONTHS.map((m, i) => <SelectItem key={m} value={i.toString()}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex flex-col gap-1.5 w-full md:w-auto flex-1">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Crime Type
            </label>
            <Select value={crimeFilter} onValueChange={setCrimeFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Crimes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Crimes</SelectItem>
                {CRIME_TYPES.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
            <Button variant="outline" className="flex-1 md:flex-none" onClick={() => {
              setCityFilter("All"); setMonthFilter("All"); setCrimeFilter("All"); setSearchQuery("");
            }}>
              <RefreshCw className="w-4 h-4 mr-2" /> Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Total Incidents", value: totalIncidents.toLocaleString(), icon: Target, desc: "Filtered records" },
          { title: "Case Closure Rate", value: `${percentClosed}%`, icon: ShieldCheck, desc: "Cases successfully closed" },
          { title: "Avg Victim Age", value: avgAge, icon: Users, desc: "Median demographic" },
          { title: "Most Affected City", value: mostAffectedCity, icon: TrendingUp, desc: "Highest incident volume" }
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold tracking-tight text-foreground">{stat.value}</p>
                  </div>
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4">{stat.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 - Top Crime Types + Weapons side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" /> Top Crime Types
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topCrimes} layout="vertical" margin={{ top: 5, right: 30, left: 90, bottom: 5 }}>
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} width={85} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: 'hsl(222 47% 8%)', borderColor: 'hsl(217 32% 17%)', color: 'hsl(210 40% 96%)' }} />
                <Bar dataKey="value" fill="#dc2626" radius={[0, 4, 4, 0]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-500" /> Weapons Used in Offenses
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weaponCounts} layout="vertical" margin={{ top: 5, right: 30, left: 90, bottom: 5 }}>
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} width={85} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: 'hsl(222 47% 8%)', borderColor: 'hsl(217 32% 17%)', color: 'hsl(210 40% 96%)' }} />
                <Bar dataKey="value" fill="#f97316" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 - Crime Domain Pie Chart full width */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" /> Crime Domain Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
              <Pie
                data={domainCounts}
                cx="50%"
                cy="45%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={3}
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                labelLine={{ stroke: 'hsl(215 20% 55%)' }}
              >
                {domainCounts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(222 47% 8%)', borderColor: 'hsl(217 32% 17%)', color: 'hsl(210 40% 96%)' }}
                formatter={(value: number, name: string) => [value.toLocaleString(), name]}
              />
              <Legend
                wrapperStyle={{ fontSize: '13px', paddingTop: '12px' }}
                formatter={(value) => <span style={{ color: 'hsl(210 40% 96%)' }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-border bg-card">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-lg">Incident Registry</CardTitle>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search registry..." 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Report No.</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Weapon</TableHead>
                  <TableHead>Deployed</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length > 0 ? paginatedData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-mono text-xs">{row.reportNumber}</TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.city}</TableCell>
                    <TableCell className="font-medium text-primary/80">{row.crimeType}</TableCell>
                    <TableCell>{row.victimAge}</TableCell>
                    <TableCell>{row.gender}</TableCell>
                    <TableCell>{row.weaponUsed}</TableCell>
                    <TableCell>{row.policeDeployed}</TableCell>
                    <TableCell>
                      {row.caseClosed ? (
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Closed</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">Open</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                      No incidents found matching criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalIncidents)}-{Math.min(currentPage * itemsPerPage, totalIncidents)} of {totalIncidents} records
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                Prev
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0}>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}