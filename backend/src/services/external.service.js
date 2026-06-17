export const fetchCompanyEnrichment = async () => {
  try {
    const response = await fetch('https://random-data-api.com/api/company/random_company');
    if (!response.ok) {
      throw new Error('Failed to fetch enrichment data');
    }
    const data = await response.json();
    return {
      companyName: data.business_name,
      industry: data.industry,
      city: data.city,
    };
  } catch (error) {
    return {
      companyName: 'Unknown Company',
      industry: 'Unknown Industry',
      city: 'Unknown City',
    };
  }
};
