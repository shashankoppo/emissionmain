import { FileText } from 'lucide-react';

export default function Terms() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <FileText className="w-12 h-12 text-black mb-4" />
          <h1 className="text-4xl font-bold text-black mb-4">Terms & Conditions</h1>
          <p className="text-gray-600">Last updated: January 2024</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">Agreement to Terms</h2>
            <p className="text-gray-600 mb-4">
              By accessing and using the Emission by Krish Sports website and services, you agree to
              be bound by these Terms and Conditions. If you disagree with any part of these terms,
              you may not access our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">Products and Services</h2>
            <p className="text-gray-600 mb-4">
              Emission by Krish Sports manufactures and supplies sportswear and medical wear for
              institutional and bulk buyers. All product specifications, prices, and availability are
              subject to change without notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">Orders and Pricing</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>All orders are subject to acceptance and availability</li>
              <li>Prices quoted are wholesale rates for bulk orders meeting MOQ requirements</li>
              <li>Custom orders require formal quotation and approval</li>
              <li>Payment terms are established on a per-order basis for institutional buyers</li>
              <li>All prices are exclusive of GST unless otherwise stated</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">Minimum Order Quantity</h2>
            <p className="text-gray-600 mb-4">
              Products are available for bulk purchase only. Minimum order quantities vary by product
              and are specified in product descriptions and quotations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">Delivery and Shipping</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Delivery timelines are provided at the time of order confirmation</li>
              <li>Shipping costs are calculated based on order volume and destination</li>
              <li>We ship across India through reliable logistics partners</li>
              <li>Delivery delays due to unforeseen circumstances are not our responsibility</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">Quality Assurance</h2>
            <p className="text-gray-600 mb-4">
              All products are manufactured according to ISO 9001:2015 quality standards. We
              guarantee product quality and will address any manufacturing defects as per our quality
              policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">Returns and Refunds</h2>
            <p className="text-gray-600 mb-4">
              Returns are accepted only for manufacturing defects and must be reported within 7 days
              of delivery. Custom-made and branded products are not eligible for return unless there
              is a manufacturing defect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">Intellectual Property</h2>
            <p className="text-gray-600 mb-4">
              All content, trademarks, and designs on this website are the property of Emission by
              Krish Sports. Unauthorized use is prohibited.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">Limitation of Liability</h2>
            <p className="text-gray-600 mb-4">
              Emission by Krish Sports shall not be liable for any indirect, incidental, special, or
              consequential damages arising from the use of our products or services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">Governing Law</h2>
            <p className="text-gray-600 mb-4">
              These Terms and Conditions are governed by the laws of India. Any disputes shall be
              subject to the exclusive jurisdiction of courts in Jabalpur, Madhya Pradesh.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">Contact Information</h2>
            <p className="text-gray-600 mb-4">
              For questions about these Terms and Conditions, please contact:
            </p>
            <p className="text-gray-600">
              Emission by Krish Sports
              <br />
              Email: info@emission.in
              <br />
              Phone: +91 XXX XXX XXXX
              <br />
              Jabalpur, Madhya Pradesh, India
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
