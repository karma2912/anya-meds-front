'use client'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

const data = [
  { name: 'Jan', cases: 45, accuracy: 97 },
  { name: 'Feb', cases: 52, accuracy: 98 },
  { name: 'Mar', cases: 48, accuracy: 97 },
  { name: 'Apr', cases: 60, accuracy: 98 },
  { name: 'May', cases: 55, accuracy: 99 },
  { name: 'Jun', cases: 58, accuracy: 98 },
]

const topConditions = [
  { name: 'Pneumonia', count: 124, trend: 'up' },
  { name: 'Fractures', count: 87, trend: 'down' },
  { name: 'Lung Nodules', count: 65, trend: 'up' },
  { name: 'Pleural Effusion', count: 42, trend: 'stable' },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="py-4 px-8 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Icons.brain className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-blue-900">ANYA-Med</span>
          </div>
          <Button variant="ghost" className="text-blue-600">
            <Icons.user className="mr-2 h-4 w-4" />
            Dr. Yash
          </Button>
        </div>
      </header>

      <main className="min-h-[50vw] px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900">Diagnostic Dashboard</h1>
          <p className="text-gray-600">Overview of your diagnostic statistics and trends</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-800">312</div>
              <p className="text-green-600 text-sm mt-2">↑ 12% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Avg. Accuracy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-800">98.2%</div>
              <p className="text-green-600 text-sm mt-2">↑ 1.2% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Time Saved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-800">127h</div>
              <p className="text-green-600 text-sm mt-2">↑ 8% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Critical Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-800">24</div>
              <p className="text-red-600 text-sm mt-2">↓ 3 from last month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Monthly Case Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="cases" fill="#3b82f6" name="Cases Reviewed" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Top Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {topConditions.map((condition, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{condition.name}</h3>
                      <p className="text-sm text-gray-500">
                        {condition.count} cases
                      </p>
                    </div>
                    {condition.trend === 'up' ? (
                      <Icons.trendUp className="h-5 w-5 text-green-500" />
                    ) : condition.trend === 'down' ? (
                      <Icons.trendDown className="h-5 w-5 text-red-500" />
                    ) : (
                      <Icons.trendFlat className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Accuracy Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[95, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="accuracy" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="Accuracy %" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: 'Diagnosed', case: 'Pneumonia', time: '2 hours ago' },
                  { action: 'Reviewed', case: 'Fracture R-234', time: '5 hours ago' },
                  { action: 'Shared', case: 'CT Scan with Dr. Lee', time: '1 day ago' },
                  { action: 'Confirmed', case: 'Tumor analysis', time: '2 days ago' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start p-3 hover:bg-gray-50 rounded-lg">
                    <div className="bg-blue-100 p-2 rounded-md mr-4">
                      <Icons.activity className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">
                        {item.action}: <span className="text-blue-600">{item.case}</span>
                      </h3>
                      <p className="text-sm text-gray-500">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}