import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
}

export default function SEO({
    title = 'Emission - Premium Sportswear & Medical Wear Manufacturer',
    description = 'Leading OEM manufacturer of sportswear and medical wear in Jabalpur. Specialized in high-performance athletic gear and professional medical scrubs.',
    keywords = 'sportswear, medical wear, scrubs, uniforms, Jabalpur manufacturer, OEM clothing, Emission fit',
    image = 'https://images.pexels.com/photos/8844356/pexels-photo-8844356.jpeg?auto=compress&cs=tinysrgb&w=1200',
    url = 'https://emissionfit.com'
}: SEOProps) {
    const fullTitle = title.includes('Emission') ? title : `${title} | Emission`;

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={`${keywords}, ELSxGlobal, Evolucentsphere, Emission Jabalpur, Sportswear Manufacturer`} />
            <meta name="author" content="ELSxGlobal Divission of Evolucentsphere Private Limited" />
            <meta name="developer" content="ELSxGlobal Divission of Evolucentsphere Private Limited" />
            <meta name="designer" content="ELSxGlobal Divission of Evolucentsphere Private Limited" />
            <meta name="publisher" content="ELSxGlobal Divission of Evolucentsphere Private Limited" />

            {/* Open Graph / Facebook */}
            < meta property="og:type" content="website" />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            < meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url} />
            <meta property="twitter:title" content={fullTitle} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={image} />

            {/* Canonical */}
            < link rel="canonical" href={url} />
        </Helmet>
    );
}
