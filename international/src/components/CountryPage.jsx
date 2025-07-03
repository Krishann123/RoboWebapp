import React, { useState, useEffect } from 'react';
import { getCountryContent } from './db';

// We will need to create React versions of these components later
// For now, let's define them as placeholders
const Jumbotron = ({ mainText, subText }) => <div><h1>{mainText}</h1><p>{subText}</p></div>;
const Robolution = ({ roboIntro, roboSub }) => <div><h2>{roboIntro}</h2><p>{roboSub}</p></div>;
const Package = () => <div>Package Component</div>;
const Highlights = () => <div>Highlights Component</div>;
const Join = () => <div>Join Component</div>;
const NewsAndUpdate = () => <div>News And Update Component</div>;
const FrequentlyAsk = () => <div>Frequently Ask Component</div>;
const Partners = () => <div>Partners Component</div>;


const CountryPage = () => {
    const [template, setTemplate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                // Extract slug from browser's URL (e.g., /indonesia -> indonesia)
                const slug = window.location.pathname.split('/').filter(Boolean)[0];
                console.log(`Fetching content for slug: ${slug}`);
                
                const data = await getCountryContent(slug);
                
                if (data) {
                    setTemplate(data);
                } else {
                    setError('Country template not found.');
                }
            } catch (err) {
                setError('Failed to load page data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, []);

    if (loading) {
        return <div>Loading page...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }
    
    if (!template) {
        return <div>Could not load country data.</div>
    }

    return (
        <div>
            {/* 
              This is a simplified structure. We will need to convert the real 
              .astro components to React and pass the full props.
            */}
            <Jumbotron 
                mainText={template.Home?.hero?.mainText}
                subText={template.Home?.hero?.subText}
            />
            <Robolution
                roboIntro={template.Home?.Robolution?.title1?.intro1}
                roboSub={template.Home?.Robolution?.title1?.sub1}
            />
            <Package />
            <Highlights />
            <Join />
            <NewsAndUpdate />
            <FrequentlyAsk />
            <Partners />
        </div>
    );
};

export default CountryPage; 