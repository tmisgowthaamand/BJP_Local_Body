# 📋 BJP Local Body Project - Candidate Registration 13-Step Updates & Cloudinary Integration Guide

## 📌 Document Purpose
This document serves as the official specification for:
1. **13-Step Candidate Registration Architecture**.
2. **Official BJP Membership Portal Link (`https://membership.bjp.org/`)** in Step 3.
3. **Cloudinary Cloud Media Storage Integration** (Photos, MP4 Pitch Videos, PDF/Word Documents).
4. **Candidate Photo Upload (10MB limit)** in Step 4.
5. **`ℹ️` Info Icon Guides & Sample Texts** for Step 9 and Step 10.
6. **Candidate Profile Document Upload (PDF/Word)** in Step 11.
7. **Admin Panel Media & Cloudinary Asset Inspection** for District Organisers.

---

## ☁️ 1. Cloudinary Integration Architecture & Folder Structure

All candidate uploads (Photos, Videos, PDF/Word documents) will be uploaded and stored directly in **Cloudinary Cloud Storage**, organized under dedicated applicant folders.

### 🔑 Cloudinary Environment & Database Configuration (`backend/.env`):
```env
CLOUDINARY_CLOUD_NAME=n9fgemea
CLOUDINARY_API_KEY=587186263567254
CLOUDINARY_API_SECRET=p6auY1cSEsSPjVE56Ii19gBzQ_k

# DB1: READ-ONLY DATABASE (13.72 Lakh Electoral Roll Voters across 5 Assemblies)
MONGO_VOTER_URL=mongodb+srv://tmisgowthaamand_db_user:UQZ0VVD9waDPex2l@cluster0.5q8xfoa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
MONGO_VOTER_DB_NAME=voter_db

# DB2: READ & WRITE DATABASE (Candidate Registrations tbl_enquiry, Users, Organiser Updates)
MONGO_APP_URL=mongodb+srv://tmisgowthaamand_db_user:UQZ0VVD9waDPex2l@cluster0.5q8xfoa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
MONGO_APP_DB_NAME=election_app
```

### 📂 Cloudinary Folder Structure:
```
Cloudinary Root (n9fgemea)
 └── 📁 BJP_Local_Body_Candidates/
      └── 📁 {bjp_applicant_no}/   (e.g., BJP-APP-2026-84920)
           ├── 🖼️ photo_profile.jpg     (Candidate Profile Photo - Max 10MB)
           ├── 🎥 video_pitch.mp4        (Candidate 1-Min Pitch Video / MP4)
           └── 📄 profile_document.pdf   (Candidate Bio-Data / Profile - Max 15MB)
```

---

## 👁️ 2. Admin Panel Cloudinary Media Inspection for District Organisers

When a District Organiser views candidate details in the Admin Panel ([`AdminViewDetailsModal.jsx`](file:///c:/Users/Admin/OneDrive/Desktop/Report/BJP_Local_Body/frontend/src/components/AdminViewDetailsModal.jsx)), all uploaded media items are fetched directly from Cloudinary URLs (`https://res.cloudinary.com/n9fgemea/...`).

### 🎨 Visual Layout Mockup in Admin Panel:

```markdown
┌─────────────────────────────────────────────────────────────────────────────┐
│ 👤 CANDIDATE DETAILS MODAL (Admin View - Organiser Control)                  │
│ Application ID: BJP-APP-2026-84920  | Status: Confirmed                      │
│ ☁️ Cloudinary Folder: BJP_Local_Body_Candidates/BJP-APP-2026-84920/         │
├─────────────────────────────────────────────────────────────────────────────┤
│ 🖼️ CANDIDATE PROFILE PHOTO                                                  │
│ ┌───────────────┐ Candidate Name: K. Sundaram                               │
│ │               │ Mobile: +91 9876543210                                    │
│ │ [Photo Image] │ District: Coimbatore | Ward: Ward 14                      │
│ │ (10MB Max)    │ Cloudinary URL: https://res.cloudinary.com/n9fgemea/image/ │
│ └───────────────┘ 🔍 [View High-Res Photo]  ✏️ [Replace Photo]               │
├─────────────────────────────────────────────────────────────────────────────┤
│ 🎥 CANDIDATE PITCH VIDEO                                                    │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ 🎬 [ Embedded HTML5 Player playing Cloudinary MP4 Video Stream ]       │ │
│ │ ▶ Play Video (Cloudinary URL: https://res.cloudinary.com/n9fgemea/video)│ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│  ✏️ [Edit Video Link]  📤 [Upload New MP4 to Cloudinary]                    │
├─────────────────────────────────────────────────────────────────────────────┤
│ 📄 CANDIDATE ELECTION PROFILE DOCUMENT                                       │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ 📄 Candidate_BioData_Ward14.pdf                                         │ │
│ │ Cloudinary Document URL: https://res.cloudinary.com/n9fgemea/raw/upload │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│  👁️ [View PDF in Browser]  ⬇️ [Download from Cloudinary]                    │
│  ✏️ [Replace PDF/Word Document]                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ 🆔 VOTER EPIC IDENTIFICATION                                                │
│  • Voter EPIC No: TN/04/182/984723                                          │
│  • Assembly: Coimbatore South | Booth No: 42 | Polling Station: School Bldg │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔍 3. Cloudinary Upload Specifications Table

| Asset Type | Allowed Extensions | Max Size | Cloudinary Resource Type | Cloudinary Folder Path |
|---|---|---|---|---|
| **🖼️ Candidate Photo** | `.jpg`, `.jpeg`, `.png`, `.webp` | **10 MB** | `image` | `BJP_Local_Body_Candidates/{bjp_applicant_no}/photo` |
| **🎥 Pitch Video** | `.mp4`, `.mov`, `.mkv` | **50 MB** | `video` | `BJP_Local_Body_Candidates/{bjp_applicant_no}/video` |
| **📄 Profile Document** | `.pdf`, `.doc`, `.docx` | **15 MB** | `raw` / `auto` | `BJP_Local_Body_Candidates/{bjp_applicant_no}/document` |

---

## 🏛️ 4. Admin Panel - District Organiser Full Step 1 to 13 Edit Permissions

If a candidate makes a mistake during their registration, the **District Organiser** can view and edit **every single field from Step 1 to Step 13** directly inside the Admin Panel.

### 🔑 Organiser Permission Matrix Across Steps 1 to 13:

```mermaid
graph TD
    CandidateApp[Candidate Application Steps 1 to 13] -- Upload Files --> Cloudinary[Cloudinary Cloud Storage: n9fgemea]
    Cloudinary -- Store in Applicant Folder --> Folder[BJP_Local_Body_Candidates/BJP-APP-NO/]
    Folder -- Fetch Secure URLs --> AdminPanel[Admin Panel: AdminViewDetailsModal.jsx]
    Organiser[District Organiser / Admin] -- Login role: 'organizer' --> AdminPanel
    AdminPanel --> EditStep1_3[✏️ Edit Mobile, Name, Passcode, BJP Membership ID]
    AdminPanel --> EditStep4[🖼️ Replace Photo on Cloudinary - JPG/PNG max 10MB]
    AdminPanel --> EditStep5_7[✏️ Edit District, Assembly, Ward, & Position]
    AdminPanel --> EditStep8[🎥 Replace Video URL / Upload MP4 to Cloudinary]
    AdminPanel --> EditStep9_10[✏️ Edit Experience, Gov Profile, Strategy & Qs]
    AdminPanel --> EditStep11[📄 Replace Profile PDF/Word Document on Cloudinary]
    AdminPanel --> ActionSubmit[💾 Save Organiser Changes & Audit Log Trail]
```

---

## 📊 5. Master 13-Step Admin Organiser Edit Matrix

| Step # | Registration Step | Candidate Input | Cloudinary Storage & Admin Organiser Edit Permissions |
|---|---|---|---|
| **Step 01** | Mobile Login | Mobile, Name, Passcode | ✏️ Full Edit (Mobile / Name / Passcode Reset) |
| **Step 02** | OTP Verification | 6-Digit OTP | ✏️ Override / Re-verify OTP Status |
| **Step 03** | BJP Membership ID | Membership ID & Portal Link | ✏️ Edit Membership ID / Verify [https://membership.bjp.org/](https://membership.bjp.org/) |
| **Step 04** | Candidate Photo | Photo Upload (10MB) | 🖼️ **Stored at `.../{applicant_no}/photo` - Replace Photo on Cloudinary** |
| **Step 05** | Electoral Area | District, Assembly, Ward | ✏️ Full Edit (District / Constituency / Ward) |
| **Step 06** | Local Body Details | Body Category | ✏️ Change Corporation / Municipality / Panchayat |
| **Step 07** | Position Applied For | Target Role / Position | ✏️ Change Applied Position |
| **Step 08** | Social Media & Video | Handles & Pitch Video | 🎥 **Stored at `.../{applicant_no}/video` - Play In-Browser MP4 & Replace Video** |
| **Step 09** | Work Experience | Party Posts & Gov Profile | ✏️ Edit Experience & Gov Profile (with `ℹ️` Guide) |
| **Step 10** | Ward Vision & Strategy | Local Issues & Campaign Plan | ✏️ Edit Ward Issues, Winning Strategy & Extra Qs |
| **Step 11** | Candidate Profile Doc | Bio-Data Upload | 📄 **Stored at `.../{applicant_no}/document` - View PDF/Word & Replace Document** |
| **Step 12** | Application Review | Form Summary | 🔍 Full Review Display |
| **Step 13** | Submission & Card | Submission & ID Card | 🛡️ **Regenerate ID Card / Change Status / Delete / Unlock** |

---

*File updated: [`BJP_Local_Body_Updates_Analysis.md`](file:///c:/Users/Admin/OneDrive/Desktop/Report/BJP_Local_Body/BJP_Local_Body_Updates_Analysis.md)*
