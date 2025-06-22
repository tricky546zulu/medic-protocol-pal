
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pill, Search, Shield, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-violet-50 to-sky-100">
      <div className="container mx-auto px-4 py-12">
        {/* Medical Disclaimer */}
        <div className="max-w-4xl mx-auto mb-8">
          <MedicalDisclaimer />
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-100 rounded-2xl border border-blue-200">
              <Pill className="h-10 w-10 text-blue-700" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Saskatchewan EMS
            <span className="bg-gradient-to-r from-sky-600 via-violet-600 to-rose-600 bg-clip-text text-transparent"> Medications</span>
          </h1>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed font-medium">
            Official provincial emergency medical services protocols and dosing guidelines for EMS professionals
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button asChild size="lg" className="text-base px-6 py-3 rounded-xl shadow-sm bg-blue-500 hover:bg-blue-600 border-blue-500">
              <Link to="/medications" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Browse Medications
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg" className="text-base px-6 py-3 rounded-xl border-violet-200 hover:border-violet-300 text-violet-700 hover:text-violet-800 hover:bg-violet-50">
              <Link to="/admin" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Admin Access
              </Link>
            </Button>
          </div>
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card className="border border-gray-200 shadow-sm bg-white rounded-xl overflow-hidden hover:shadow-md transition-all duration-200">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-blue-100 rounded-xl w-fit mx-auto mb-4 border border-blue-200">
                <Search className="h-6 w-6 text-blue-700" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Instant Search</h3>
              <p className="text-gray-700 leading-relaxed font-medium">
                Find medications quickly with intelligent search across names, indications, and classifications
              </p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm bg-white rounded-xl overflow-hidden hover:shadow-md transition-all duration-200">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-violet-100 rounded-xl w-fit mx-auto mb-4 border border-violet-200">
                <Shield className="h-6 w-6 text-violet-700" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Safety First</h3>
              <p className="text-gray-700 leading-relaxed font-medium">
                Provincial protocols with built-in safety alerts and dosing verification for all patient types
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer Notice */}
        <div className="mt-12 text-center text-sm text-gray-600 max-w-2xl mx-auto">
          <p className="mb-1 font-medium">
            © 2024 Saskatchewan Emergency Medical Services
          </p>
          <p className="text-xs">
            This application contains official provincial protocols. For the most current information, 
            always consult your local medical director and current protocol publications.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
