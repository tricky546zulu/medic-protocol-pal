
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pill, Search, Shield, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20 max-w-4xl mx-auto">
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl">
              <Pill className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Saskatchewan EMS
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent"> Medications</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Quick access to provincial emergency medical services protocols and dosing guidelines
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <Link to="/medications" className="flex items-center gap-3">
                <Search className="h-5 w-5" />
                Browse Medications
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg" className="text-lg px-8 py-6 rounded-xl border-2 hover:bg-gray-50">
              <Link to="/admin" className="flex items-center gap-3">
                <Shield className="h-5 w-5" />
                Admin Access
              </Link>
            </Button>
          </div>
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group">
            <CardContent className="p-8 text-center">
              <div className="p-3 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl w-fit mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Instant Search</h3>
              <p className="text-gray-600 leading-relaxed">
                Find medications quickly with intelligent search across names, indications, and classifications
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group">
            <CardContent className="p-8 text-center">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl w-fit mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Safety First</h3>
              <p className="text-gray-600 leading-relaxed">
                Provincial protocols with built-in safety alerts and dosing verification for all patient types
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-primary/5 to-blue-50 rounded-2xl p-8 max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Saskatchewan Health Authority Approved
          </h2>
          <p className="text-gray-700 mb-6">
            Based on the official EMS Provincial Medications Manual (November 2024)
          </p>
          <div className="flex justify-center items-center gap-8 text-sm text-gray-600">
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold text-primary mb-1">Adult</div>
              <div>Protocols</div>
            </div>
            <div className="w-px h-12 bg-gray-300"></div>
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold text-primary mb-1">Pediatric</div>
              <div>Guidelines</div>
            </div>
            <div className="w-px h-12 bg-gray-300"></div>
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold text-destructive mb-1">Safety</div>
              <div>Alerts</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
