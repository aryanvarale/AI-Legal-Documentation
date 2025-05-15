import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FilePlus, ArrowLeft } from "lucide-react";

// Import images from assets
// Ration Card Images
import Ration1 from "@/assets/Ration/Ration1.jpg";
import Ration2 from "@/assets/Ration/Ration2.jpg";
import Ration3 from "@/assets/Ration/Ration3.jpg";
import Ration4 from "@/assets/Ration/Ration4.jpg";
import Ration5 from "@/assets/Ration/Ration5.jpg";
import Ration6 from "@/assets/Ration/Ration6.jpg";

// Aadhaar Card Images
import Aadhar1 from "@/assets/Aadhar/Aadhar1.jpg";
import Aadhar2 from "@/assets/Aadhar/Aadhar2.jpg";
import Aadhar3 from "@/assets/Aadhar/Aadhar3.jpg";

// Voter ID Images
import Voter1 from "@/assets/VoterID/Voter1.jpg";
import Voter2 from "@/assets/VoterID/Voter2.jpg";
import Voter3 from "@/assets/VoterID/Voter3.jpg";
import Voter4 from "@/assets/VoterID/Voter4.jpg";
import Voter6 from "@/assets/VoterID/Voter6.jpg";
import Voter7 from "@/assets/VoterID/Voter7.jpg";

// Driving License Image
import DrivingLicense from "@/assets/Driving licsense.jpg";

// Document data for Indian documents
const indianDocuments = [
  {
    id: "aadhar",
    name: "Aadhaar Card",
    description: "A 12-digit unique identity number issued by the UIDAI.",
    onlineProcess: [
      "Visit the official UIDAI website (uidai.gov.in)",
      "Click on 'Aadhaar Enrollment/Update'",
      "Fill the application form with required personal details",
      "Upload necessary documents (proof of identity, address, and date of birth)",
      "Book an appointment at the nearest Aadhaar Enrollment Center for biometric capture",
      "Visit the center on the scheduled date for biometric details (fingerprints, iris scan, photograph)",
      "Receive acknowledgment slip with 14-digit enrollment number",
      "Track application status using this number on the UIDAI website",
      "Receive Aadhaar card via post or download e-Aadhaar from the website"
    ],
    offlineProcess: [
      "Visit the nearest Aadhaar Enrollment Center",
      "Collect and fill the Aadhaar enrollment form",
      "Submit the form along with required documents (proof of identity, address, and date of birth)",
      "Complete biometric capture (fingerprints, iris scan, photograph)",
      "Receive acknowledgment slip with 14-digit enrollment number",
      "Aadhaar card will be delivered by post to your registered address"
    ],
    requiredDocuments: [
      "Proof of Identity (Passport, PAN Card, Voter ID, etc.)",
      "Proof of Address (Utility bill, Bank statement, etc.)",
      "Proof of Date of Birth (Birth certificate, School certificate, etc.)",
      "Recent passport-sized photographs"
    ],
    screenshots: [
      {
        title: "Aadhaar Enrollment Form",
        description: "The official Aadhaar enrollment/update form",
        notes: "Fill this form with accurate personal details and biometric information",
        image: Aadhar1
      },
      {
        title: "Aadhaar Card Sample",
        description: "Sample Aadhaar card showing key information",
        notes: "Your Aadhaar will contain similar information including your name, DOB, gender and 12-digit number",
        image: Aadhar2
      },
      {
        title: "Aadhaar Verification Process",
        description: "Biometric verification during the Aadhaar process",
        notes: "Biometric data includes fingerprints, iris scan and photograph",
        image: Aadhar3
      }
    ]
  },
  {
    id: "ration",
    name: "Ration Card",
    description: "Government-issued document for purchasing subsidized food grains and essential commodities.",
    onlineProcess: [
      "Visit your state's PDS (Public Distribution System) portal",
      "Register and create an account",
      "Fill the online application form with family details",
      "Upload required documents (proof of identity, address, income certificate, etc.)",
      "Submit the application and note the application reference number",
      "Track application status online using the reference number",
      "Visit the designated center for verification if required",
      "Collect the ration card or download e-ration card from the portal"
    ],
    offlineProcess: [
      "Visit your local Ration Office or Food Supply Office",
      "Collect the ration card application form",
      "Fill the form with all required details of family members",
      "Attach necessary documents (proof of identity, address, income certificate, etc.)",
      "Submit the completed form at the office",
      "Receive acknowledgment receipt with application number",
      "Field verification may be conducted by authorities",
      "Collect the ration card from the office after approval"
    ],
    requiredDocuments: [
      "Proof of Identity (Aadhaar card, Voter ID, etc.)",
      "Proof of Address (Utility bill, Rent agreement, etc.)",
      "Income Certificate (for BPL cards)",
      "Family member details with photographs",
      "Existing ration card (if applying for modification)"
    ],
    screenshots: [
      {
        title: "Registration Page",
        description: "Initial registration screen for Ration Card",
        notes: "Shows options for existing card holders and new applicants",
        image: Ration1
      },
      {
        title: "System Notification",
        description: "UID verification message",
        notes: "Verification of existing details in the system",
        image: Ration2
      },
      {
        title: "User Dashboard",
        description: "RCMS dashboard with ration card details",
        notes: "Shows card status and application details",
        image: Ration3
      },
      {
        title: "Application Form",
        description: "Family member details entry form",
        notes: "First member must be Head of Family",
        image: Ration4
      },
      {
        title: "Card Details",
        description: "Card type and scheme details",
        notes: "Shows priority status and scheme type",
        image: Ration5
      },
      {
        title: "Verification Status",
        description: "Application verification status",
        notes: "Track your application status online",
        image: Ration6
      }
    ]
  },
  {
    id: "pan",
    name: "PAN Card",
    description: "Permanent Account Number issued by the Income Tax Department for financial transactions.",
    onlineProcess: [
      "Visit the official NSDL website (tin-nsdl.com) or UTIITSL website (utiitsl.com)",
      "Select 'Apply for New PAN' option",
      "Choose 'Form 49A' for Indian citizens or 'Form 49AA' for foreign citizens",
      "Fill the online form with personal and required details",
      "Upload scanned copies of required documents and photograph/signature",
      "Make the application fee payment online",
      "Submit the application and note the acknowledgment number",
      "Track application status using the acknowledgment number",
      "PAN card will be delivered to your registered address"
    ],
    offlineProcess: [
      "Visit the nearest NSDL/UTIITSL center or authorized PAN service center",
      "Collect Form 49A (for Indian citizens) or Form 49AA (for foreign citizens)",
      "Fill the form with required details",
      "Attach necessary documents and photographs",
      "Pay the application fee",
      "Submit the form at the center",
      "Receive acknowledgment receipt",
      "PAN card will be delivered to your address by post"
    ],
    requiredDocuments: [
      "Proof of Identity (Passport, Voter ID, Aadhaar Card, etc.)",
      "Proof of Address (Utility bill, Bank statement, etc.)",
      "Proof of Date of Birth (Birth certificate, School certificate, etc.)",
      "Recent passport-sized photographs"
    ]
  },
  {
    id: "voter",
    name: "Voter ID Card",
    description: "Election Photo Identity Card (EPIC) issued by the Election Commission of India for voting.",
    onlineProcess: [
      "Visit the National Voters' Services Portal (nvsp.in)",
      "Click on 'Apply online for registration of new voter/due to shifting'",
      "Fill Form 6 with required personal details",
      "Upload scanned copies of documents and photograph",
      "Submit the application and note the reference number",
      "Track application status using the reference number",
      "Electoral Registration Officer will verify the details",
      "Your name will be added to the electoral roll after verification",
      "Voter ID card will be delivered to your address"
    ],
    offlineProcess: [
      "Visit your local Electoral Registration Office",
      "Collect Form 6",
      "Fill the form with required details",
      "Attach necessary documents and photographs",
      "Submit the form at the office",
      "Receive acknowledgment receipt",
      "Booth Level Officer may visit for verification",
      "Collect the Voter ID card from the office after approval"
    ],
    requiredDocuments: [
      "Proof of Identity (Aadhaar card, Passport, etc.)",
      "Proof of Address (Utility bill, Bank statement, etc.)",
      "Proof of Age (Birth certificate, School certificate, etc.)",
      "Recent passport-sized photographs"
    ],
    screenshots: [
      {
        title: "Voter Registration Form",
        description: "Form 6 for new voter registration",
        notes: "Fill all details accurately to avoid rejection",
        image: Voter1
      },
      {
        title: "Voter Portal",
        description: "National Voter Service Portal interface",
        notes: "Online portal for all voter ID services",
        image: Voter2
      },
      {
        title: "Application Status",
        description: "Status tracking for voter ID application",
        notes: "Track your application using reference number",
        image: Voter3
      },
      {
        title: "Voter Verification",
        description: "Verification process for voter identity",
        notes: "Electoral officers verify submitted details",
        image: Voter4
      },
      {
        title: "Electoral Roll",
        description: "Sample electoral roll entry",
        notes: "Your details will appear in electoral roll after verification",
        image: Voter6
      },
      {
        title: "Voter ID Card",
        description: "Sample Voter ID card (EPIC)",
        notes: "Final card contains your photo and electoral details",
        image: Voter7
      }
    ]
  },
  {
    id: "driving",
    name: "Driving License",
    description: "Official document permitting an individual to drive motor vehicles on public roads.",
    onlineProcess: [
      "Visit your state's transport department website or Parivahan Sewa portal (parivahan.gov.in)",
      "Register and create an account",
      "Apply for a Learner's License first",
      "Fill the online application form with personal details",
      "Upload required documents",
      "Pay the application fee online",
      "Book a slot for Learner's License test",
      "After passing the test, apply for a Permanent Driving License",
      "Book a slot for the driving test",
      "After passing the driving test, the license will be processed and delivered"
    ],
    offlineProcess: [
      "Visit your local Regional Transport Office (RTO)",
      "Collect the Learner's License application form",
      "Fill the form with required details",
      "Attach necessary documents and photographs",
      "Pay the application fee",
      "Take the Learner's License test",
      "After obtaining the Learner's License, practice driving for at least 30 days",
      "Apply for the Permanent Driving License",
      "Take the driving test",
      "If successful, collect the Driving License from the RTO"
    ],
    requiredDocuments: [
      "Proof of Identity (Aadhaar card, Passport, etc.)",
      "Proof of Address (Utility bill, Bank statement, etc.)",
      "Proof of Age (Birth certificate, School certificate, etc.)",
      "Medical certificate (Form 1A)",
      "Recent passport-sized photographs"
    ],
    screenshots: [
      {
        title: "Driving License Application",
        description: "Application form for driving license",
        notes: "Fill personal details and vehicle category",
        image: DrivingLicense
      }
    ]
  }
];

const IndianDocuments = () => {
  const [selectedDocument, setSelectedDocument] = useState(null);

  const handleBackClick = () => {
    setSelectedDocument(null);
  };

  if (selectedDocument) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={handleBackClick} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Documents
          </Button>
          <h1 className="text-2xl font-bold">{selectedDocument.name}</h1>
        </div>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="mb-6">{selectedDocument.description}</p>
          
          <h2 className="text-xl font-semibold mb-2">Online Application Process</h2>
          <ol className="list-decimal pl-5 mb-6 space-y-2">
            {selectedDocument.onlineProcess.map((step, index) => (
              <li key={`online-${index}`}>{step}</li>
            ))}
          </ol>
          
          <h2 className="text-xl font-semibold mb-2">Offline Application Process</h2>
          <ol className="list-decimal pl-5 mb-6 space-y-2">
            {selectedDocument.offlineProcess.map((step, index) => (
              <li key={`offline-${index}`}>{step}</li>
            ))}
          </ol>
          
          <h2 className="text-xl font-semibold mb-2">Required Documents</h2>
          <ul className="list-disc pl-5 space-y-2 mb-6">
            {selectedDocument.requiredDocuments.map((doc, index) => (
              <li key={`doc-${index}`}>{doc}</li>
            ))}
          </ul>
          
          {selectedDocument.screenshots && (
            <>
              <h2 className="text-xl font-semibold mb-4">Application Process Screenshots</h2>
              <p className="text-sm text-gray-500 mb-4">These screenshots show the actual application process for {selectedDocument.name}.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {selectedDocument.screenshots.map((screenshot, index) => (
                  <div key={`screenshot-${index}`} className="border rounded-lg overflow-hidden">
                    <div className="bg-blue-50 p-2 border-b">
                      <h3 className="font-medium text-sm">{screenshot.title}</h3>
                      <p className="text-xs text-gray-600">{screenshot.description}</p>
                    </div>
                    <div className="p-2 bg-gray-50">
                      <img 
                        src={screenshot.image} 
                        alt={screenshot.title} 
                        className="w-full h-40 object-cover border rounded shadow-sm"
                      />
                      <p className="mt-1 text-xs text-gray-500 italic">{screenshot.notes}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-sm">
                <p className="font-medium text-yellow-800">Important Note:</p>
                <p className="text-yellow-700 mt-1">
                  The screenshots above are from the official government portals. 
                  The interface may differ slightly based on your state and changes to the system, but the general process remains similar.
                </p>
              </div>
            </>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Indian Document Guide</h1>
      <p className="text-gray-600">Click on any document to view detailed application information</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {indianDocuments.map((doc) => (
          <Card 
            key={doc.id} 
            className="p-4 cursor-pointer hover:shadow-md transition-shadow" 
            onClick={() => setSelectedDocument(doc)}
          >
            <h3 className="text-lg font-bold mb-2">{doc.name}</h3>
            <p className="text-sm text-gray-600 mb-3">{doc.description}</p>
            <div className="flex justify-end">
              <Button size="sm">
                <FilePlus className="h-4 w-4 mr-1" /> View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const CreateDocument = IndianDocuments;
export default CreateDocument;
