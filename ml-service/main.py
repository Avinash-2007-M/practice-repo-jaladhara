from fastapi import (
    FastAPI,
    UploadFile,
    File,
    HTTPException
)

from fastapi.middleware.cors import CORSMiddleware


from services.csv_processor import (
    load_csv,
    prepare_dataset
)

from services.feature_engineering import (
    build_company_features
)

from services.scoring import (
    calculate_all_scores,
    NGO_FOCUS
)

from services.analysis import (
    generate_dataset_insights,
    company_to_dict
)


# ============================================================
# FASTAPI
# ============================================================

app = FastAPI(
    title="JalDonorAI ML Service",
    description="CSR donor intelligence and prospect ranking",
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=["*"],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"]
)


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root():

    return {
        "message":
            "JalDonorAI ML Service is running"
    }


# ============================================================
# HEALTH
# ============================================================

@app.get("/health")
def health():

    return {
        "status": "healthy",
        "service": "ml-service"
    }


# ============================================================
# ANALYZE
# ============================================================

@app.post("/analyze")
async def analyze(
    file: UploadFile = File(...)
):

    try:

        # ----------------------------------------------------
        # Validate filename
        # ----------------------------------------------------

        if not file.filename:

            raise HTTPException(
                status_code=400,
                detail="File is required."
            )

        if not file.filename.lower().endswith(
            ".csv"
        ):

            raise HTTPException(
                status_code=400,
                detail="Only CSV files are supported."
            )

        print(
            f"\nReceived file: {file.filename}"
        )

        # ----------------------------------------------------
        # Read file
        # ----------------------------------------------------

        file_bytes = await file.read()

        # ----------------------------------------------------
        # Load CSV
        # ----------------------------------------------------

        raw_df = load_csv(
            file_bytes
        )

        # ----------------------------------------------------
        # Clean + validate dataset
        # ----------------------------------------------------

        df = prepare_dataset(
            raw_df
        )

        # ----------------------------------------------------
        # Create company-level features
        # ----------------------------------------------------

        companies = build_company_features(
            df
        )

        # ----------------------------------------------------
        # Calculate ML scores
        # ----------------------------------------------------

        companies = calculate_all_scores(
            companies
        )

        # ----------------------------------------------------
        # Generate insights
        # ----------------------------------------------------

        insights = generate_dataset_insights(
            df,
            companies
        )

        # ----------------------------------------------------
        # Top 20 companies
        # ----------------------------------------------------

        top_companies_df = (
            companies
            .head(20)
        )

        top_companies = []

        for _, row in (
            top_companies_df.iterrows()
        ):

            top_companies.append(
                company_to_dict(row)
            )

        # ----------------------------------------------------
        # Final response
        # ----------------------------------------------------

        response = {

            "success": True,

            "fileName":
                file.filename,

            "totalCompanies":
                int(len(companies)),

            "totalRecords":
                int(len(df)),

            "analysisMethod": {

                "type":
                    "Data-driven CSR prospect ranking",

                "semanticModel":
                    "TF-IDF + Cosine Similarity",

                "rankingFactors": [

                    "CSR thematic relevance",

                    "Historical CSR spending",

                    "Recent CSR activity",

                    "Number of active financial years",

                    "CSR project count",

                    "Company type"
                ]
            },

            "ngoFocus":
                NGO_FOCUS,

            "insights":
                insights,

            "topCompanies":
                top_companies
        }

        print(
            f"\nAnalysis completed."
        )

        print(
            f"Companies analyzed: {len(companies)}"
        )

        print(
            "====================================\n"
        )

        return response

    except HTTPException:

        raise

    except Exception as error:

        print(
            "\n========== ML SERVICE ERROR =========="
        )

        print(
            repr(error)
        )

        print(
            "======================================\n"
        )

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )