
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pill, Search, Shield, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Professional Blue Header */}
      <div className="bg-blue-600 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Pill className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-3">
              SK EMS Meds
            </h1>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Official provincial emergency medical services protocols and dosing guidelines
            </p>
            
            {/* Integrated Search CTA */}
            <div className="max-w-md mx-auto mb-6">
              <Button asChild size="lg" className="w-full text-base px-6 py-4 rounded-lg bg-white text-blue-600 hover:bg-blue-50 shadow-lg">
                <Link to="/medications" className="flex items-center justify-center gap-3">
                  <Search className="h-5 w-5" />
                  Search Medications
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
            <Button variant="outline" asChild size="lg" className="text-base px-6 py-3 rounded-lg border-white/30 hover:bg-white/10 text-white">
              <Link to="/admin" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Admin Access
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 flex-1">
        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card className="border border-gray-200 bg-white rounded-lg hover:shadow-md transition-all duration-200">
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

          <Card className="border border-gray-200 bg-white rounded-lg hover:shadow-md transition-all duration-200">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-blue-50 rounded-lg w-fit mx-auto mb-4">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Safety First</h3>
              <p className="text-gray-600">
                Provincial protocols with built-in safety alerts and dosing verification for all patient types
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Subtle Footer with Disclaimer */}
      <footer className="py-6 bg-gray-100 border-t border-gray-200">
        <div className="container mx-auto">
          <MedicalDisclaimer />
          <div className="mt-4 text-center text-sm text-gray-500">
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
