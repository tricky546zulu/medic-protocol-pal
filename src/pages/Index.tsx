
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pill, Search, Shield, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-violet-50 to-sky-100 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-blue-50/30"></div>
      <div className="relative container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20 max-w-4xl mx-auto">
          <div className="flex justify-center mb-8">
            <div className="p-6 bg-gradient-to-br from-sky-100/90 to-blue-200/80 backdrop-blur-lg rounded-3xl shadow-2xl shadow-sky-200/50 ring-1 ring-blue-200/40 hover:scale-105 transition-all duration-300">
              <Pill className="h-12 w-12 text-sky-700" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Saskatchewan EMS
            <span className="bg-gradient-to-r from-sky-600 via-violet-600 to-rose-600 bg-clip-text text-transparent"> Medications</span>
          </h1>
          <p className="text-xl text-gray-700 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
            Quick access to provincial emergency medical services protocols and dosing guidelines
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="text-lg px-8 py-6 rounded-2xl shadow-2xl shadow-sky-300/50 hover:shadow-2xl hover:shadow-sky-400/60 transition-all duration-300 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 border-0 hover:scale-105">
              <Link to="/medications" className="flex items-center gap-3">
                <Search className="h-5 w-5" />
                Browse Medications
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg" className="text-lg px-8 py-6 rounded-2xl border-2 bg-white/80 backdrop-blur-lg hover:bg-white/90 border-violet-200/60 hover:border-violet-300/80 text-violet-700 hover:text-violet-800 shadow-xl shadow-violet-200/40 hover:shadow-2xl hover:shadow-violet-300/50 transition-all duration-300 hover:scale-105">
              <Link to="/admin" className="flex items-center gap-3">
                <Shield className="h-5 w-5" />
                Admin Access
              </Link>
            </Button>
          </div>
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="border-0 shadow-2xl shadow-sky-200/60 bg-white/85 backdrop-blur-lg hover:shadow-2xl hover:shadow-sky-300/70 transition-all duration-300 group ring-1 ring-sky-200/30 hover:ring-sky-300/50 rounded-3xl overflow-hidden hover:scale-[1.02]">
            <CardContent className="p-8 text-center">
              <div className="p-4 bg-gradient-to-br from-sky-100/90 to-blue-200/80 backdrop-blur-sm rounded-2xl w-fit mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-sky-200/50 ring-1 ring-sky-200/40">
                <Search className="h-8 w-8 text-sky-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Instant Search</h3>
              <p className="text-gray-700 leading-relaxed font-medium">
                Find medications quickly with intelligent search across names, indications, and classifications
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-2xl shadow-violet-200/60 bg-white/85 backdrop-blur-lg hover:shadow-2xl hover:shadow-violet-300/70 transition-all duration-300 group ring-1 ring-violet-200/30 hover:ring-violet-300/50 rounded-3xl overflow-hidden hover:scale-[1.02]">
            <CardContent className="p-8 text-center">
              <div className="p-4 bg-gradient-to-br from-violet-100/90 to-purple-200/80 backdrop-blur-sm rounded-2xl w-fit mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-violet-200/50 ring-1 ring-violet-200/40">
                <Shield className="h-8 w-8 text-violet-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Safety First</h3>
              <p className="text-gray-700 leading-relaxed font-medium">
                Provincial protocols with built-in safety alerts and dosing verification for all patient types
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
