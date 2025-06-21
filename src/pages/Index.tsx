
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pill, Search, Shield, Database, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <Pill className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Saskatchewan EMS Medications
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Comprehensive digital reference for provincial emergency medical services 
          medication protocols, dosing guidelines, and administration procedures.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link to="/medications" className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Browse Medications
            </Link>
          </Button>
          <Button variant="outline" asChild size="lg">
            <Link to="/admin" className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Admin Panel
            </Link>
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <Card className="text-center">
          <CardHeader>
            <Pill className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle>Comprehensive Database</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Complete medication profiles with indications, contraindications, 
              and detailed dosing information for all patient populations.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <Search className="h-12 w-12 text-primary mx-auto mb-4" /> {/* Or another semantic color if appropriate */}
            <CardTitle>Quick Search</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Instantly find medications by name with powerful search functionality 
              designed for emergency situations.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <CardTitle>Safety Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              High-alert medications are clearly marked with safety warnings 
              and special handling instructions.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="bg-blue-50 rounded-lg p-8 text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
          Provincial EMS Medication Protocols
        </h2>
        <p className="text-gray-700 mb-6">
          Based on the Saskatchewan Health Authority Emergency Medical Services 
          Provincial Medications Manual (November 2024)
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-4">
            <div className="text-3xl font-bold text-primary mb-2">Adult</div> {/* text-blue-600 -> text-primary */}
            <div className="text-gray-600">Patient Protocols</div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="text-3xl font-bold text-primary mb-2">Pediatric</div> {/* text-green-600 -> text-primary */}
            <div className="text-gray-600">Dosing Guidelines</div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="text-3xl font-bold text-destructive mb-2">High-Alert</div> {/* text-red-600 -> text-destructive */}
            <div className="text-gray-600">Safety Protocols</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
