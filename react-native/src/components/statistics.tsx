import React from "react";
import { Card, CardBody, Tabs, Tab } from "@heroui/react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";

interface DataPoint {
  date: string;
  temperature: number;
  ph: number;
  ammonia: number;
  nitrate: number;
}

export const Statistics = () => {
  const [selected, setSelected] = React.useState("week");
  
  const weekData: DataPoint[] = [
    { date: "Lun", temperature: 24.2, ph: 6.8, ammonia: 0.25, nitrate: 5 },
    { date: "Mar", temperature: 24.5, ph: 6.9, ammonia: 0.2, nitrate: 5 },
    { date: "Mié", temperature: 24.8, ph: 7.0, ammonia: 0.15, nitrate: 10 },
    { date: "Jue", temperature: 25.0, ph: 7.1, ammonia: 0.1, nitrate: 10 },
    { date: "Vie", temperature: 24.7, ph: 7.0, ammonia: 0.25, nitrate: 15 },
    { date: "Sáb", temperature: 24.5, ph: 6.9, ammonia: 0.3, nitrate: 15 },
    { date: "Dom", temperature: 24.3, ph: 6.8, ammonia: 0.25, nitrate: 10 },
  ];
  
  const monthData: DataPoint[] = [
    { date: "Sem 1", temperature: 24.5, ph: 6.8, ammonia: 0.2, nitrate: 5 },
    { date: "Sem 2", temperature: 24.7, ph: 7.0, ammonia: 0.15, nitrate: 10 },
    { date: "Sem 3", temperature: 24.3, ph: 6.9, ammonia: 0.25, nitrate: 15 },
    { date: "Sem 4", temperature: 24.5, ph: 6.8, ammonia: 0.2, nitrate: 10 },
  ];
  
  const yearData: DataPoint[] = [
    { date: "Ene", temperature: 24.0, ph: 6.7, ammonia: 0.3, nitrate: 5 },
    { date: "Feb", temperature: 24.2, ph: 6.8, ammonia: 0.25, nitrate: 10 },
    { date: "Mar", temperature: 24.5, ph: 6.9, ammonia: 0.2, nitrate: 15 },
    { date: "Abr", temperature: 24.8, ph: 7.0, ammonia: 0.15, nitrate: 10 },
    { date: "May", temperature: 25.0, ph: 7.1, ammonia: 0.1, nitrate: 5 },
    { date: "Jun", temperature: 25.2, ph: 7.0, ammonia: 0.15, nitrate: 10 },
  ];
  
  const getData = () => {
    switch (selected) {
      case "week": return weekData;
      case "month": return monthData;
      case "year": return yearData;
      default: return weekData;
    }
  };
  
  const [selectedParameter, setSelectedParameter] = React.useState("all");
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Estadísticas</h2>
      
      <Card>
        <CardBody className="p-4">
          <Tabs 
            aria-label="Periodo de tiempo"
            selectedKey={selected}
            onSelectionChange={setSelected as any}
            variant="light"
            color="primary"
            size="sm"
            className="mb-4"
          >
            <Tab key="week" title="Semana" />
            <Tab key="month" title="Mes" />
            <Tab key="year" title="Año" />
          </Tabs>
          
          <Tabs
            aria-label="Parámetros"
            selectedKey={selectedParameter}
            onSelectionChange={setSelectedParameter as any}
            variant="bordered"
            color="primary"
            size="sm"
            className="mb-6"
          >
            <Tab key="all" title="Todos" />
            <Tab key="temperature" title="Temperatura" />
            <Tab key="ph" title="pH" />
            <Tab key="ammonia" title="Amonio" />
            <Tab key="nitrate" title="Nitratos" />
          </Tabs>
          
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={getData()}
                margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  yAxisId="left"
                  axisLine={false}
                  tickLine={false}
                  domain={[23, 26]}
                  hide={selectedParameter !== "all" && selectedParameter !== "temperature"}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  axisLine={false}
                  tickLine={false}
                  domain={[6, 8]}
                  hide={selectedParameter !== "all" && selectedParameter !== "ph"}
                />
                <YAxis 
                  yAxisId="ammonia"
                  orientation="right"
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 0.5]}
                  hide={selectedParameter !== "all" && selectedParameter !== "ammonia"}
                />
                <YAxis 
                  yAxisId="nitrate"
                  orientation="right"
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 20]}
                  hide={selectedParameter !== "all" && selectedParameter !== "nitrate"}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--heroui-content1))', 
                    borderColor: 'hsl(var(--heroui-divider))',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend />
                {(selectedParameter === "all" || selectedParameter === "temperature") && (
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="temperature" 
                    name="Temperatura (°C)"
                    stroke="hsl(var(--heroui-primary-500))" 
                    activeDot={{ r: 6 }} 
                    strokeWidth={2}
                  />
                )}
                {(selectedParameter === "all" || selectedParameter === "ph") && (
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="ph" 
                    name="pH"
                    stroke="hsl(var(--heroui-secondary-500))" 
                    activeDot={{ r: 6 }} 
                    strokeWidth={2}
                  />
                )}
                {(selectedParameter === "all" || selectedParameter === "ammonia") && (
                  <Line 
                    yAxisId="ammonia"
                    type="monotone" 
                    dataKey="ammonia" 
                    name="Amonio (ppm)"
                    stroke="hsl(var(--heroui-warning-500))" 
                    activeDot={{ r: 6 }} 
                    strokeWidth={2}
                  />
                )}
                {(selectedParameter === "all" || selectedParameter === "nitrate") && (
                  <Line 
                    yAxisId="nitrate"
                    type="monotone" 
                    dataKey="nitrate" 
                    name="Nitratos (ppm)"
                    stroke="hsl(var(--heroui-danger-500))" 
                    activeDot={{ r: 6 }} 
                    strokeWidth={2}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>
      
      <Card>
        <CardBody className="p-4">
          <h3 className="text-lg font-semibold mb-4">Rangos ideales</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Temperatura</span>
                <span className="text-sm text-foreground-500">23°C - 26°C</span>
              </div>
              <div className="h-2 bg-default-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary-500 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">pH</span>
                <span className="text-sm text-foreground-500">6.5 - 7.5</span>
              </div>
              <div className="h-2 bg-default-100 rounded-full overflow-hidden">
                <div className="h-full bg-secondary-500 rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Amonio</span>
                <span className="text-sm text-foreground-500">0.0 - 0.25 ppm</span>
              </div>
              <div className="h-2 bg-default-100 rounded-full overflow-hidden">
                <div className="h-full bg-warning-500 rounded-full" style={{ width: '50%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Nitratos</span>
                <span className="text-sm text-foreground-500">0 - 20 ppm</span>
              </div>
              <div className="h-2 bg-default-100 rounded-full overflow-hidden">
                <div className="h-full bg-danger-500 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};