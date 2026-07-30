'use client'

import { useState, useRef, useEffect } from 'react'
import { X, CheckCircle } from 'lucide-react'

interface SignatureModalProps {
  isOpen: boolean
  onClose: () => void
  onSign: (signature: string) => Promise<void>
  type: 'contract' | 'handover'
  projectName: string
  companyName: string
  contractText?: string | null
}

export default function SignatureModal({ isOpen, onClose, onSign, type, projectName, companyName, contractText: customContractText }: SignatureModalProps) {
  const [signature, setSignature] = useState('')
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      setSignature('')
      setIsScrolledToBottom(false)
      setIsSubmitting(false)
    }
  }, [isOpen])

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement
    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 20) {
      setIsScrolledToBottom(true)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!signature.trim()) return
    setIsSubmitting(true)
    await onSign(signature)
    setIsSubmitting(false)
  }

  if (!isOpen) return null

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
The Service Provider, operating through its digital division SiteRadiant, agrees to perform design and development services as specified below for the project "${projectName}":
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

  let finalContractText = customContractText || defaultContractText;

  try {
    if (customContractText && customContractText.trim().startsWith('{')) {
      const vars = JSON.parse(customContractText);
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
The Service Provider, operating through its digital division SiteRadiant, agrees to perform design and development services as specified below for the project "${projectName}":
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
    // If it's not JSON, it might just be the raw text from an older version
    console.error("Failed to parse customContractText");
  }

  const handoverText = `
PROJECT HANDOVER & ACCEPTANCE

This Project Handover Document formally concludes the active development phase of the project: "${projectName}" by ${companyName}.

1. ACCEPTANCE OF DELIVERABLES
Client acknowledges that all agreed-upon deliverables, features, and services for this project have been completed, reviewed, and accepted.

2. FINAL SIGN-OFF
By signing this document, the Client confirms that the project meets the requirements outlined in the original agreement and subsequent change requests.

3. POST-HANDOVER SUPPORT
Any future modifications, additions, or support requests outside the agreed warranty period will be treated as a new project or billed under a separate maintenance agreement.

4. FINAL CLEARANCE
Client agrees that all outstanding invoices related to this project must be settled immediately upon handover, if not already paid.

By signing below, the Client formally accepts the handover of the project.
`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-2xl shadow-xl flex flex-col max-h-[90vh] border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
              {type === 'contract' ? 'Project Agreement' : 'Project Handover Document'}
            </h2>
            <p className="text-sm text-zinc-500 mt-1">{projectName}</p>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="p-6 overflow-y-auto flex-1 text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap font-serif leading-relaxed"
        >
          <div className="bg-zinc-50 dark:bg-zinc-950/50 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="whitespace-pre-wrap font-serif text-zinc-800 dark:text-zinc-200">
              {type === 'contract' ? finalContractText.trim() : handoverText.trim()}
            </div>
            
            {/* Service Provider Signature Block */}
            {type === 'contract' && (
              <div className="mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-end">
                <div>
                  <p className="text-sm text-zinc-500 mb-2">Service Provider Signature</p>
                  <div className="flex items-center gap-2 text-green-600 font-medium">
                    <CheckCircle size={18} />
                    <span>Digitally Signed by SiteRadiant</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-zinc-500 mb-2">Client Signature</p>
                  <div className="h-8 border-b-2 border-zinc-300 dark:border-zinc-700 w-48 border-dashed"></div>
                </div>
              </div>
            )}
          </div>
          
          {!isScrolledToBottom && (
            <div className="mt-4 p-3 bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 rounded-lg text-sm flex items-center gap-2 border border-amber-200 dark:border-amber-800/30">
              Please scroll to the bottom to read all terms before signing.
            </div>
          )}
        </div>

        <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 shrink-0 bg-zinc-50 dark:bg-zinc-900/50 rounded-b-2xl">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Type your full name to E-Sign
              </label>
              <input
                type="text"
                required
                value={signature}
                onChange={e => setSignature(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-2 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:border-zinc-900 dark:focus:border-white outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting || !signature.trim() || !isScrolledToBottom}
              className="w-full sm:w-auto px-6 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <CheckCircle size={18} />
              {isSubmitting ? 'Signing...' : 'Sign & Accept'}
            </button>
          </form>
          <p className="text-xs text-zinc-500 mt-4 text-center">
            By clicking "Sign & Accept", you agree that your typed name constitutes a legally binding digital signature.
          </p>
        </div>
      </div>
    </div>
  )
}
