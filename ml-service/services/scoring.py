from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


NGO_FOCUS = (
    "drinking water "
    "clean water "
    "safe drinking water "
    "water supply "
    "water conservation "
    "water sanitation "
    "hygiene "
    "sanitation "
    "WASH "
    "toilet "
    "community water "
    "rural water "
    "public health "
    "water infrastructure"
)


def calculate_csr_relevance(companies):
    """
    Calculate semantic similarity between each company's
    actual CSR sectors/sub-sectors and the NGO's focus.

    TF-IDF + cosine similarity is used here.
    """

    companies = companies.copy()

    documents = (
        companies["csr_text"]
        .fillna("")
        .astype(str)
        .tolist()
    )

    if not any(
        document.strip()
        for document in documents
    ):

        companies["csr_relevance"] = 0.0

        return companies

    vectorizer = TfidfVectorizer(
        lowercase=True,
        stop_words="english",
        ngram_range=(1, 2)
    )

    try:

        document_vectors = (
            vectorizer.fit_transform(
                documents
            )
        )

        ngo_vector = (
            vectorizer.transform(
                [NGO_FOCUS]
            )
        )

        similarity = cosine_similarity(
            document_vectors,
            ngo_vector
        ).flatten()

        companies["csr_relevance"] = similarity

    except ValueError:

        companies["csr_relevance"] = 0.0

    return companies


def calculate_company_type_score(companies):
    """
    Give a small suitability factor based on the
    company type actually present in the dataset.
    """

    companies = companies.copy()

    def calculate(value):

        value = (
            str(value)
            .lower()
            .strip()
        )

        if "non" in value and "psu" in value:
            return 1.0

        if "private" in value:
            return 1.0

        if "public" in value:
            return 0.9

        if "psu" in value:
            return 0.75

        return 0.5

    companies["company_type_score"] = (
        companies["company_type"]
        .apply(calculate)
    )

    return companies


def calculate_prospect_score(companies):
    """
    Combine actual dataset-derived features into
    a prospect ranking score.

    This is a ranking score, NOT a probability.
    """

    companies = companies.copy()

    companies["prospect_score"] = (

        companies["csr_relevance"] * 0.40

        + companies["spending_score"] * 0.20

        + companies["recency_score"] * 0.15

        + companies["activity_score"] * 0.10

        + companies["project_score"] * 0.10

        + companies["company_type_score"] * 0.05
    )

    companies["prospect_score"] = (
        companies["prospect_score"]
        .clip(0, 1)
        * 100
    )

    companies = (
        companies
        .sort_values(
            "prospect_score",
            ascending=False
        )
        .reset_index(drop=True)
    )

    return companies


def calculate_all_scores(companies):

    companies = calculate_csr_relevance(
        companies
    )

    companies = calculate_company_type_score(
        companies
    )

    companies = calculate_prospect_score(
        companies
    )

    return companies