import re
import numpy as np
import pandas as pd


def extract_year(value):
    """
    Extract the first four-digit year from
    the Financial Year field.
    """

    value = str(value)

    match = re.search(
        r"(20\d{2})",
        value
    )

    if match:
        return int(match.group(1))

    return np.nan


def min_max(series):
    """
    Normalize a numerical series between 0 and 1.
    """

    series = pd.to_numeric(
        series,
        errors="coerce"
    ).fillna(0)

    minimum = series.min()
    maximum = series.max()

    if maximum == minimum:

        return pd.Series(
            0.0,
            index=series.index
        )

    return (
        (series - minimum) /
        (maximum - minimum)
    )


def build_company_features(df):
    """
    Convert project-level CSR records into
    company-level historical features.
    """

    df = df.copy()

    # --------------------------------------------------------
    # Extract financial year
    # --------------------------------------------------------

    df["year"] = (
        df["financial_year"]
        .apply(extract_year)
    )

    # --------------------------------------------------------
    # Combine CSR sector information
    # --------------------------------------------------------

    df["csr_text"] = (
        df["csr_sector"].fillna("")
        + " "
        + df["csr_sub_sector"].fillna("")
    )

    # --------------------------------------------------------
    # Latest year in uploaded dataset
    # --------------------------------------------------------

    valid_years = (
        df["year"]
        .dropna()
    )

    if len(valid_years) > 0:
        latest_dataset_year = int(
            valid_years.max()
        )
    else:
        latest_dataset_year = 0

    # --------------------------------------------------------
    # Company aggregation
    # --------------------------------------------------------

    companies = (
        df.groupby("company_name")
        .agg(

            company_type=(
                "company_type",
                lambda x:
                x.dropna().iloc[0]
                if len(x.dropna()) > 0
                else ""
            ),

            states=(
                "csr_state",
                lambda x:
                sorted(
                    set(
                        value
                        for value in x
                        if value
                    )
                )
            ),

            financial_years=(
                "financial_year",
                lambda x:
                sorted(
                    set(
                        value
                        for value in x
                        if value
                    )
                )
            ),

            sectors=(
                "csr_sector",
                lambda x:
                sorted(
                    set(
                        value
                        for value in x
                        if value
                    )
                )
            ),

            sub_sectors=(
                "csr_sub_sector",
                lambda x:
                sorted(
                    set(
                        value
                        for value in x
                        if value
                    )
                )
            ),

            total_spend=(
                "project_amount",
                "sum"
            ),

            average_project_spend=(
                "project_amount",
                "mean"
            ),

            project_count=(
                "project_amount",
                "count"
            ),

            latest_year=(
                "year",
                "max"
            ),

            csr_text=(
                "csr_text",
                lambda x:
                " ".join(
                    sorted(
                        set(
                            value
                            for value in x
                            if value
                        )
                    )
                )
            )
        )
        .reset_index()
    )

    # --------------------------------------------------------
    # Number of active years
    # --------------------------------------------------------

    companies["years_active"] = (
        companies["financial_years"]
        .apply(len)
    )

    # --------------------------------------------------------
    # Recency
    # --------------------------------------------------------

    if latest_dataset_year > 0:

        companies["recency_score"] = (
            companies["latest_year"]
            .fillna(0)
            .apply(
                lambda year:
                max(
                    0,
                    1 -
                    (
                        (
                            latest_dataset_year - year
                        ) / 10
                    )
                )
                if year > 0
                else 0
            )
        )

    else:

        companies["recency_score"] = 0.0

    # --------------------------------------------------------
    # Historical spending
    # --------------------------------------------------------

    companies["spending_score"] = min_max(
        np.log1p(
            companies["total_spend"]
        )
    )

    # --------------------------------------------------------
    # CSR activity
    # --------------------------------------------------------

    companies["activity_score"] = min_max(
        companies["years_active"]
    )

    # --------------------------------------------------------
    # Project count
    # --------------------------------------------------------

    companies["project_score"] = min_max(
        companies["project_count"]
    )

    return companies