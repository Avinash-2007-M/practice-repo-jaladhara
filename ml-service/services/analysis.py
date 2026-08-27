def generate_recommendations(row):

    recommendations = []

    combined_text = (
        " ".join(row["sectors"])
        + " "
        + " ".join(row["sub_sectors"])
    ).lower()

    # --------------------------------------------------------
    # Thematic recommendation
    # --------------------------------------------------------

    if any(
        keyword in combined_text
        for keyword in [
            "water",
            "drinking",
            "sanitation",
            "hygiene",
            "wash"
        ]
    ):

        recommendations.append(
            "Prioritize outreach around drinking water, "
            "hygiene and sanitation initiatives."
        )

    # --------------------------------------------------------
    # Historical spending
    # --------------------------------------------------------

    if row["total_spend"] > 0:

        recommendations.append(
            "Use the company's historical CSR spending "
            "when preparing the funding proposal."
        )

    # --------------------------------------------------------
    # Multi-year activity
    # --------------------------------------------------------

    if row["years_active"] >= 2:

        recommendations.append(
            "Consider a multi-year partnership because "
            "the company has CSR activity across multiple "
            "financial years."
        )

    # --------------------------------------------------------
    # Geography
    # --------------------------------------------------------

    if row["states"]:

        recommendations.append(
            "Prioritize project locations that align with "
            "the company's historical CSR geography."
        )

    # --------------------------------------------------------
    # Fallback based on actual data
    # --------------------------------------------------------

    if not recommendations:

        recommendations.append(
            "Review the company's historical CSR sectors "
            "and geographic activity before outreach."
        )

    return recommendations


def company_to_dict(row):

    return {

        "companyName":
            row["company_name"],

        "companyType":
            row["company_type"],

        "prospectScore":
            round(
                float(
                    row["prospect_score"]
                ),
                2
            ),

        "csrRelevance":
            round(
                float(
                    row["csr_relevance"] * 100
                ),
                2
            ),

        "totalHistoricalSpend":
            round(
                float(
                    row["total_spend"]
                ),
                2
            ),

        "averageProjectSpend":
            round(
                float(
                    row["average_project_spend"]
                ),
                2
            ),

        "projectCount":
            int(
                row["project_count"]
            ),

        "yearsActive":
            int(
                row["years_active"]
            ),

        "financialYears":
            row["financial_years"],

        "states":
            row["states"],

        "csrSectors":
            row["sectors"],

        "csrSubSectors":
            row["sub_sectors"],

        "recommendations":
            generate_recommendations(row)
    }


def generate_dataset_insights(
    df,
    companies
):

    total_spend = float(
        df["project_amount"].sum()
    )

    # --------------------------------------------------------
    # Sector distribution
    # --------------------------------------------------------

    sector_counts = (
        df["csr_sector"]
        .replace("", None)
        .dropna()
        .value_counts()
        .head(10)
    )

    top_sectors = []

    for sector, count in sector_counts.items():

        top_sectors.append(
            {
                "sector": str(sector),
                "projectCount": int(count)
            }
        )

    # --------------------------------------------------------
    # State distribution
    # --------------------------------------------------------

    state_counts = (
        df["csr_state"]
        .replace("", None)
        .dropna()
        .value_counts()
        .head(10)
    )

    top_states = []

    for state, count in state_counts.items():

        top_states.append(
            {
                "state": str(state),
                "projectCount": int(count)
            }
        )

    # --------------------------------------------------------
    # Financial year distribution
    # --------------------------------------------------------

    year_counts = (
        df["financial_year"]
        .replace("", None)
        .dropna()
        .value_counts()
        .sort_index()
    )

    yearly_activity = []

    for year, count in year_counts.items():

        yearly_activity.append(
            {
                "financialYear": str(year),
                "projectCount": int(count)
            }
        )

    # --------------------------------------------------------
    # Top CSR-relevant prospects
    # --------------------------------------------------------

    high_relevance_count = int(
        (
            companies["csr_relevance"] >= 0.30
        ).sum()
    )

    return {

        "totalCompanies":
            int(len(companies)),

        "totalProjects":
            int(len(df)),

        "totalHistoricalCSRSpend":
            round(
                total_spend,
                2
            ),

        "csrRelevantCompanies":
            high_relevance_count,

        "topSectors":
            top_sectors,

        "topStates":
            top_states,

        "financialYearDistribution":
            yearly_activity
    }