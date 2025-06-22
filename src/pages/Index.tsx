
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pill, Search, Shield, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-violet-50 to-sky-100 flex flex-col">
      <div className="container mx-auto px-4 py-12 flex-1">
        {/* Hero Section */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-100 rounded-xl">
              <Pill className="h-10 w-10 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Saskatchewan EMS
            <span className="bg-gradient-to-r from-sky-600 via-violet-600 to-rose-600 bg-clip-text text-transparent"> Medications</span>
          </h1>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Official provincial emergency medical services protocols and dosing guidelines for EMS professionals
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="text-base px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600">
              <Link to="/medications" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Browse Medications
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg" className="text-base px-6 py-3 rounded-lg border-violet-200 hover:bg-violet-50 text-violet-700">
              <Link to="/admin" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Admin Access
              </Link>
            </Button>
          </div>
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card className="border border-gray-200 bg-white rounded-lg hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-blue-50 rounded-lg w-fit mx-auto mb-4">
                <Search className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Instant Search</h3>
              <p className="text-gray-600">
                Find medications quickly with intelligent search across names, indications, and classifications
              </p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 bg-white rounded-lg hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-violet-50 rounded-lg w-fit mx-auto mb-4">
                <Shield className="h-6 w-6 text-violet-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Safety First</h3>
              <p className="text-gray-600">
                Provincial protocols with built-in safety alerts and dosing verification for all patient types
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer with Disclaimer */}
      <footer className="py-8 bg-white border-t border-gray-200">
        <div className="container mx-auto">
          <MedicalDisclaimer />
          <div className="mt-6 text-center text-sm text-gray-500">
            <p className="mb-1">© 2024 Saskatchewan Emergency Medical Services</p>
            <p className="text-xs">
              For the most current information, always consult your local medical director and current protocol publications.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
