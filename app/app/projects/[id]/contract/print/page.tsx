import prisma from '@/utils/prisma'
import { notFound } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import PrintButton from './PrintButton'
import { format } from 'date-fns'

export default async function PrintContractPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  
  const project = await prisma.project.findUnique({
    where: { id: resolvedParams.id },
    include: { client: true }
  })

  if (!project) notFound()

  const defaultContractText = `WEB DESIGN AND DEVELOPMENT AGREEMENT

SERVICE PROVIDER: GLOBAL ONE LOGISTICS AND DISTRIBUTION (Operating and Doing Business As "SiteRadiant") 
Registered Address: House No: 0031, Unit: 006, Sector: GHO, Node: Ghansoli, Ghansoli, Navi Mumbai, Thane, Maharashtra, 400701
GSTIN: 27ABCFG1029Q1Z6 
Email: support@siteradiant.co.in | Website: www.siteradiant.co.in

CLIENT: 
Company Name: [Client’s Company Name or Individual Name] 
Registered Address: [Client’s Full Physical Address, City, State, Country, Zip Code] 
Primary Email: [Client’s Primary Business Email Address]

The Service Provider and the Client are collectively referred to as the "Parties."

1. SCOPE OF WORK & DELIVERABLES
The Service Provider, operating through its digital division SiteRadiant, agrees to perform design and development services as specified below for the project "${project.name}":
- Setup and design of a [Number]-page website (Pages: Home, About, Services, etc.).
- Mobile responsive layout and cross-device optimization.
- Integration of standard contact forms and corporate social media links.
- [Basic / Standard / Advanced] search engine optimization (SEO) implementation.
- Payment gateway integration (applicable only if an e-commerce plan is selected).

Any work, assets, custom functionalities, or feature requests not explicitly listed in this section or in an attached annexure shall be considered out-of-scope and subject to a separate fee estimate.

2. COMPENSATION & PAYMENT TERMS
The total fee for the project is fixed at [₹₹₹ / $$$]. Payments shall be processed under the corporate entity "Global One Logistics and Distribution" via [Razorpay MoneySaver / Bank Transfer / UPI] according to the following strict milestones:
- Milestone 1: 25% non-refundable deposit due immediately upon signing, before any design or development work commences.
- Milestone 2: 25% progress payment due upon the Client's structural approval of the visual website layout, wireframe, or design prototype.
- Milestone 3: 50% final balance payment due immediately upon completion of functional development and staging testing. This final payment must be settled in full prior to live server deployment or the handover of administrative credentials.

3. REVISIONS, CHANGE ORDERS, AND ADD-ONS
The Client is entitled to a maximum of [Number, e.g., 2] rounds of consolidated revisions during the design prototype stage.
Any major structural modifications requested after design approval, or any requests beyond the allotted rounds, will be billed on a flat "Per-Change" basis in accordance with the Service Provider's standard Add-On Rate Menu (Annexure A). No additional work will be performed or billed without the Client’s explicit, written approval of a specific fixed-price quote before the work begins.

4. CLIENT RESPONSIBILITIES & PROJECT ABANDONMENT
Asset Delivery: The Client agrees to provide all text copy, high-resolution images, corporate logos, and required administrative login credentials within [Number, e.g., 14] business days of signing this contract. The Service Provider is not responsible for project delays caused by the Client’s failure to provide assets or feedback in a timely manner.
Project Abandonment (Ghosting Clause): If the Client fails to provide necessary assets, feedback, or communication for a period exceeding 30 consecutive calendar days, the project will be deemed "Abandoned." In such an event, all work will be paused, all fees paid up to that date will be forfeited to the service provider, and a flat reactivation fee of [₹₹₹ / $$$] will apply to resume the project at a later date.

5. INTELLECTUAL PROPERTY & OWNERSHIP TRANSFER
All intellectual property rights, source code, graphics, and design assets developed under this Agreement remain the sole property of the Service Provider until the final Milestone 3 payment is received and cleared in full.
Upon receipt of the final milestone payment, full legal ownership, rights, and titles shall automatically transfer to the Client. The Service Provider retains the permanent right to display screenshots and links of the completed website in their professional portfolio under the brand name SiteRadiant.

6. TERMINATION & CANCELLATION
Either party may terminate this Agreement at any time with [Number, e.g., 7] days written notice.
If the Client terminates the project before final deployment, the initial 25% deposit (Milestone 1) remains entirely non-refundable. Additionally, the Client shall pay a prorated fee corresponding to the percentage of work completed up to the date of termination (e.g., if a milestone is in-progress but not yet fully approved, the Service Provider will assess a fair percentage of completion), as documented by the Service Provider.

7. POST-LAUNCH WARRANTY & SUPPORT
Upon successful live deployment, the Service Provider provides a [Number, e.g., 14 or 30]-day complimentary warranty period. This warranty strictly covers the fixing of unexpected bugs, broken links, or structural alignment issues that deviate from the approved staging version. It does not cover new feature additions, layout redesigns, or content changes, which will be billed separately under Annexure A.

8. LIMITATION OF LIABILITY
The Service Provider shall not be liable for any lost profits, lost revenue, data loss, server downtime, security breaches, or indirect consequential damages arising from the use or inability to use the website. In no event shall the Service Provider’s total liability exceed the total exact amount actually paid by the Client under this Agreement.

9. GOVERNING LAW AND JURISDICTION
This Agreement shall be governed by the laws of India. Any disputes arising out of this contract shall be subject to the exclusive jurisdiction of the courts located in [Your City/State, India].

IN WITNESS WHEREOF, the Parties have executed this Agreement by digital signature below.

ANNEXURE A: ADDITIONAL SITE CHANGES & ADD-ON MENU (All prices are fixed and billed per item upon written approval)
- Additional Standard Page: New Page matching current design like FAQs ($50 / ₹1500)
- Custom Feature Integration: Setup of Booking Calendar, Advanced Forms etc ($25 / ₹5000)
- Payment Gateway Setup: Integration of new payment processor ($35 / ₹3000)
- Major Layout Redesign: Complete restructuring of an approved layout ($55 / ₹5000)`;

  let finalContractText = project.contractText || defaultContractText;

  try {
    if (project.contractText && project.contractText.trim().startsWith('{')) {
      const vars = JSON.parse(project.contractText);
      finalContractText = `WEB DESIGN AND DEVELOPMENT AGREEMENT

SERVICE PROVIDER: GLOBAL ONE LOGISTICS AND DISTRIBUTION (Operating and Doing Business As "SiteRadiant") 
Registered Address: House No: 0031, Unit: 006, Sector: GHO, Node: Ghansoli, Ghansoli, Navi Mumbai, Thane, Maharashtra, 400701
GSTIN: 27ABCFG1029Q1Z6 
Email: support@siteradiant.co.in | Website: www.siteradiant.co.in

CLIENT: 
Company Name: ${vars.companyName || "[Client’s Company Name or Individual Name]"} 
Registered Address: ${vars.companyAddress || "[Client’s Full Physical Address]"} 
Primary Email: ${vars.primaryEmail || "[Client’s Primary Email]"}

The Service Provider and the Client are collectively referred to as the "Parties."

1. SCOPE OF WORK & DELIVERABLES
The Service Provider, operating through its digital division SiteRadiant, agrees to perform design and development services as specified below for the project "${project.name}":
- Setup and design of a ${vars.pages || "[Number]"}-page website (Pages: Home, About, Services, etc.).
- Mobile responsive layout and cross-device optimization.
- Integration of standard contact forms and corporate social media links.
- ${vars.seoTier || "[Basic / Standard / Advanced]"} search engine optimization (SEO) implementation.
- Payment gateway integration (applicable only if an e-commerce plan is selected).

Any work, assets, custom functionalities, or feature requests not explicitly listed in this section or in an attached annexure shall be considered out-of-scope and subject to a separate fee estimate.

2. COMPENSATION & PAYMENT TERMS
The total fee for the project is fixed at ${vars.totalFee || "[₹₹₹ / $$$]"}. Payments shall be processed under the corporate entity "Global One Logistics and Distribution" via ${vars.paymentRails || "[Razorpay MoneySaver / Bank Transfer / UPI]"} according to the following strict milestones:
- Milestone 1: 25% non-refundable deposit due immediately upon signing, before any design or development work commences.
- Milestone 2: 25% progress payment due upon the Client's structural approval of the visual website layout, wireframe, or design prototype.
- Milestone 3: 50% final balance payment due immediately upon completion of functional development and staging testing. This final payment must be settled in full prior to live server deployment or the handover of administrative credentials.

3. REVISIONS, CHANGE ORDERS, AND ADD-ONS
The Client is entitled to a maximum of ${vars.revisions || "[Number]"} rounds of consolidated revisions during the design prototype stage.
Any major structural modifications requested after design approval, or any requests beyond the allotted rounds, will be billed on a flat "Per-Change" basis in accordance with the Service Provider's standard Add-On Rate Menu (Annexure A). No additional work will be performed or billed without the Client’s explicit, written approval of a specific fixed-price quote before the work begins.

4. CLIENT RESPONSIBILITIES & PROJECT ABANDONMENT
Asset Delivery: The Client agrees to provide all text copy, high-resolution images, corporate logos, and required administrative login credentials within ${vars.assetDays || "[Number]"} business days of signing this contract. The Service Provider is not responsible for project delays caused by the Client’s failure to provide assets or feedback in a timely manner.
Project Abandonment (Ghosting Clause): If the Client fails to provide necessary assets, feedback, or communication for a period exceeding 30 consecutive calendar days, the project will be deemed "Abandoned." In such an event, all work will be paused, all fees paid up to that date will be forfeited to the service provider, and a flat reactivation fee of ${vars.reactivationFee || "[₹₹₹ / $$$]"} will apply to resume the project at a later date.

5. INTELLECTUAL PROPERTY & OWNERSHIP TRANSFER
All intellectual property rights, source code, graphics, and design assets developed under this Agreement remain the sole property of the Service Provider until the final Milestone 3 payment is received and cleared in full.
Upon receipt of the final milestone payment, full legal ownership, rights, and titles shall automatically transfer to the Client. The Service Provider retains the permanent right to display screenshots and links of the completed website in their professional portfolio under the brand name SiteRadiant.

6. TERMINATION & CANCELLATION
Either party may terminate this Agreement at any time with ${vars.noticeDays || "[Number]"} days written notice.
If the Client terminates the project before final deployment, the initial 25% deposit (Milestone 1) remains entirely non-refundable. Additionally, the Client shall pay a prorated fee corresponding to the percentage of work completed up to the date of termination (e.g., if a milestone is in-progress but not yet fully approved, the Service Provider will assess a fair percentage of completion), as documented by the Service Provider.

7. POST-LAUNCH WARRANTY & SUPPORT
Upon successful live deployment, the Service Provider provides a ${vars.warrantyDays || "[Number]"}-day complimentary warranty period. This warranty strictly covers the fixing of unexpected bugs, broken links, or structural alignment issues that deviate from the approved staging version. It does not cover new feature additions, layout redesigns, or content changes, which will be billed separately under Annexure A.

8. LIMITATION OF LIABILITY
The Service Provider shall not be liable for any lost profits, lost revenue, data loss, server downtime, security breaches, or indirect consequential damages arising from the use or inability to use the website. In no event shall the Service Provider’s total liability exceed the total exact amount actually paid by the Client under this Agreement.

9. GOVERNING LAW AND JURISDICTION
This Agreement shall be governed by the laws of India. Any disputes arising out of this contract shall be subject to the exclusive jurisdiction of the courts located in ${vars.jurisdiction || "[Your City/State, India]"}.

IN WITNESS WHEREOF, the Parties have executed this Agreement by digital signature below.

ANNEXURE A: ADDITIONAL SITE CHANGES & ADD-ON MENU (All prices are fixed and billed per item upon written approval)
- Additional Standard Page: New Page matching current design like FAQs ($50 / ₹1500)
- Custom Feature Integration: Setup of Booking Calendar, Advanced Forms etc ($25 / ₹5000)
- Payment Gateway Setup: Integration of new payment processor ($35 / ₹3000)
- Major Layout Redesign: Complete restructuring of an approved layout ($55 / ₹5000)`;
    }
  } catch (e) {
    console.error("Failed to parse customContractText");
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto p-12 bg-white text-black font-serif print:p-0">
        
        {/* Print Button Header */}
        <div className="print:hidden mb-8 flex justify-end">
          <PrintButton />
        </div>

        {/* Contract Body */}
        <div className="whitespace-pre-wrap leading-relaxed text-sm">
          {finalContractText.trim()}
        </div>

        {/* Signatures */}
        <div className="mt-16 pt-8 border-t border-zinc-200 grid grid-cols-2 gap-16 font-sans">
          
          <div>
            <p className="text-sm text-zinc-500 mb-4 font-bold">SERVICE PROVIDER SIGNATURE</p>
            <div className="h-16 flex flex-col justify-center text-green-600 font-medium">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle size={18} />
                <span>Digitally Signed</span>
              </div>
              <span className="text-xs text-green-700">SiteRadiant / Global One Logistics</span>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-zinc-500 mb-4 font-bold">CLIENT SIGNATURE</p>
            <div className="h-16 flex flex-col justify-center">
              {project.contractApprovedAt ? (
                <div className="text-green-600 font-medium">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle size={18} />
                    <span>Digitally Signed by {project.contractSignedBy || "Client"}</span>
                  </div>
                  <span className="text-xs text-green-700 font-mono">
                    {format(new Date(project.contractApprovedAt), "MMM dd, yyyy 'at' hh:mm a")} • IP Verified
                  </span>
                </div>
              ) : (
                <div className="border-b-2 border-dashed border-zinc-300 w-64 h-8 mt-2"></div>
              )}
            </div>
          </div>
          
        </div>

      </div>
    </div>
  )
}
