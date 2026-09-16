import { permanentRedirect } from 'next/navigation';

/**
 * Retired landing page — the "Dashboard" nav item now links straight to /impact/dashboard
 * (which has its own KPI strip and grouped reports); the Training & Beneficiary listing this
 * page used to link to was redundant with Activities' own Trainings category and has been
 * retired too (see `/impact/training-beneficiaries`).
 */
export default function ImpactPage(): never {
  permanentRedirect('/impact/dashboard');
}
