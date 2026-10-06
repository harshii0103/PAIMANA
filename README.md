# DRISHTI
### Predictive Infrastructure Project Risk & Early Warning System

**SIH 2026 | Problem Statement: SIH26103 | MoSPI**

DRISHTI is an AI-powered infrastructure project intelligence platform designed to enhance the existing **PAIMANA** project-monitoring ecosystem of the **Ministry of Statistics & Programme Implementation (MoSPI), Government of India**.

Instead of relying only on retrospective project reporting, DRISHTI analyses project-level data to predict **cost-overrun risk** and **schedule-delay risk**, combine them into an overall project risk level, and provide explainable risk indicators and early-warning support.

> **PAIMANA tells us what is happening. DRISHTI helps us understand what may happen next, why, and where attention may be needed.**

##  What Does DRISHTI Do?

The system works through a predictive risk pipeline:

### 1. Project Data Processing

DRISHTI uses project-level PAIMANA data containing:

- Original Cost
- Revised Cost
- Expenditure
- Physical Progress
- Original & Revised Completion Dates
- Sanction Date
- Sector
- Ministry
- Agency

The data is cleaned, validated and transformed before modelling.

### 2. Feature Engineering

The system derives additional indicators such as:

- **Expenditure Ratio**
- **Project Age**
- **Time Remaining**

These features help represent the current financial and schedule condition of infrastructure projects.

### 3. Cost Overrun Risk

A **CatBoost Classifier** predicts whether a project belongs to the cost-overrun class.

```text
cost_overrun = 1  → revised_cost > original_cost
cost_overrun = 0  → otherwise
```
### 4. Schedule Delay Risk

A second CatBoost Classifier predicts schedule-delay risk.
delay_overrun = 1  → revised_completion > original_completion
delay_overrun = 0  → otherwise

 ### Risk Engine

DRISHTI combines Cost Risk and Delay Risk into a single project-level risk assessment.
Cost Risk + Delay Risk
          ↓
    Overall Risk
          ↓
 LOW | MEDIUM | HIGH
 
 | Risk Level | Probability |
| ---------- | ----------: |
| LOW        |       < 40% |
| MEDIUM     |  40% – <70% |
| HIGH       |       ≥ 70% |


## Model Performance
### Cost Overrun Risk — CatBoost

| Metric    |  Score |
| --------- | -----: |
| Accuracy  | 75.00% |
| Precision | 77.67% |
| Recall    | 78.43% |
| F1 Score  | 78.05% |
| ROC-AUC   | 0.8216 |

### Schedule Delay Risk — CatBoost
| Metric    |  Score |
| --------- | -----: |
| Accuracy  | 91.96% |
| Precision | 95.39% |
| Recall    | 94.09% |
| F1 Score  | 94.74% |
| ROC-AUC   | 0.9693 |

### Cost Model Comparison
| Model               |   Accuracy |  Precision |     Recall |         F1 |    ROC-AUC |
| ------------------- | ---------: | ---------: | ---------: | ---------: | ---------: |
| Logistic Regression |     71.67% |     75.76% |     73.53% |     74.63% |     0.8043 |
| Random Forest       |     74.44% |     79.17% |     74.51% |     76.77% |     0.8375 |
| **CatBoost**        | **75.00%** | **77.67%** | **78.43%** | **78.05%** | **0.8216** |

## Explainable AI
DRISHTI does not stop at producing a risk score.
It uses Permutation Feature Importance to identify the features the models rely on most and combines this with project-level risk indicators.

### Cost Overrun Risk
Expenditure Ratio    0.1428
Project Age          0.0388
Sector               0.0280
Original Cost        0.0262
Physical Progress    0.0202

### Schedule Delay Risk
Time Remaining       0.2005
Physical Progress    0.0120
Project Age          0.0094
Agency               0.0042
Expenditure Ratio    0.0036

## Early Warning
DRISHTI uses risk predictions and project indicators to highlight projects requiring closer attention.

Examples:
🔴 HIGH DELAY RISK
🟠 HIGH COST-OVERRUN RISK
🔴 CRITICAL OVERDUE PROJECT
🟡 MEDIUM OVERALL RISK

## System Architecture

                       PAIMANA PROJECT DATA
                              CSV / XLSX
                                  ↓
                     ┌───────────────────────┐
                     │ DATA PREPROCESSING    │
                     │ Cleaning • Validation │
                     └───────────┬───────────┘
                                 ↓
                     ┌───────────────────────┐
                     │ FEATURE ENGINEERING   │
                     │ Expenditure Ratio     │
                     │ Project Age           │
                     │ Time Remaining        │
                     └───────────┬───────────┘
                                 ↓
                  ┌──────────────┴──────────────┐
                  ↓                             ↓
        ┌────────────────────┐        ┌────────────────────┐
        │ COST RISK MODEL    │        │ DELAY RISK MODEL   │
        │     CatBoost       │        │      CatBoost      │
        └──────────┬─────────┘        └──────────┬─────────┘
                   │                             │
                   └──────────────┬──────────────┘
                                  ↓
                        ┌───────────────────┐
                        │    RISK ENGINE    │
                        │ Cost + Delay Risk │
                        └─────────┬─────────┘
                                  ↓
                        ┌───────────────────┐
                        │ EXPLAINABILITY    │
                        │ Permutation       │
                        │ Feature Importance│
                        └─────────┬─────────┘
                                  ↓
                        ┌───────────────────┐
                        │ RISK INDICATORS   │
                        │ & EARLY WARNINGS  │
                        └─────────┬─────────┘
                                  ↓
                        ┌───────────────────┐
                        │   WEB DASHBOARD   │
                        │ Portfolio • Risk  │
                        │ Project Drilldown │
                        └───────────────────┘
## Future Scope
### Historical Risk Trends
Integrate historical monthly PAIMANA reports to support:
Monthly Project Data
        ↓
Risk Trend
        ↓
Increasing / Stable / Improving
        ↓
Early Warning
### Similar-Project Benchmarking
Compare projects using characteristics such as:

-Sector
-Cost range
- Physical progress
- Expenditure
- Project age
- Schedule status

### Additional Risk Variables
Future versions can incorporate relevant variables such as:

- Contractor performance
- Land acquisition
- Approval / clearance status
- Procurement delays
- Utility shifting
- Litigation
- Environmental constraints
  
### Natural-Language Project Intelligence
A future AI assistant could support queries such as
- Which projects have the highest delay risk?
- Why is Project 706718 flagged?
- Which sector has the highest risk?
- Show high-risk projects.
  
## 🎯 Expected Impact
DRISHTI aims to help government monitoring teams, project managers and implementing agencies:

- Identify high-risk projects earlier
- Prioritize monitoring resources
- Separate cost and schedule risks
- Understand important project risk indicators
- Move beyond purely retrospective reporting
- Support proactive, evidence-based decision-making

