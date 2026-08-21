import React, { useState } from 'react';

const SECTION_DEFS = [
  { key: 'trailReview', label: 'Trail' },
  { key: 'transportReview', label: 'Transport' },
  { key: 'stayReview', label: 'Stay' },
  { key: 'seasonReview', label: 'Season' },
  { key: 'budgetReview', label: 'Budget' },
  { key: 'safetyTip', label: 'Safety & Tips' },
];

function Field({ label, value }) {
  if (value === undefined || value === null || value === '') return null;
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid var(--color-line)', fontSize: '0.88rem' }}>
      <span style={{ color: 'var(--color-ink-soft)' }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-mono)', textAlign: 'right', maxWidth: '60%' }}>{String(value)}</span>
    </div>
  );
}

function SectionBody({ sectionKey, data }) {
  if (!data) return <p style={{ color: 'var(--color-ink-soft)', fontSize: '0.88rem' }}>Reviewer didn't fill in this section.</p>;

  switch (sectionKey) {
    case 'trailReview':
      return <>
        <Field label="Difficulty rating" value={data.difficultyRating && `${data.difficultyRating}/5`} />
        <Field label="Paved / trail condition" value={data.pavedPercent && `${data.pavedPercent}% paved`} />
        <Field label="Landslide risk" value={data.landslideRisk !== undefined && (data.landslideRisk ? 'Yes' : 'No')} />
        <Field label="Fitness required" value={data.fitnessLevelRequired} />
        <Field label="Comments" value={data.comments} />
      </>;
    case 'transportReview':
      return <>
        <Field label="Mode" value={data.mode} />
        <Field label="Road condition" value={data.roadConditionBlacktopPercent && `${data.roadConditionBlacktopPercent}% blacktop`} />
        <Field label="Travel time" value={data.travelTimeHours && `${data.travelTimeHours} hrs`} />
        <Field label="Cost" value={data.cost && `Rs ${data.cost}`} />
        <Field label="Seasonal issues" value={data.seasonalIssues} />
      </>;
    case 'stayReview':
      return <>
        <Field label="Stay type" value={data.stayType} />
        <Field label="Cost per night" value={data.costPerNight && `Rs ${data.costPerNight}`} />
        <Field label="Cleanliness" value={data.cleanlinessRating && `${data.cleanlinessRating}/5`} />
        <Field label="Food quality" value={data.foodQualityRating && `${data.foodQualityRating}/5`} />
        <Field label="Hot water" value={data.hotWaterAvailable !== undefined && (data.hotWaterAvailable ? 'Available' : 'Not available')} />
        <Field label="Charging" value={data.chargingAvailable !== undefined && (data.chargingAvailable ? 'Available' : 'Not available')} />
      </>;
    case 'seasonReview':
      return <>
        <Field label="Best season" value={data.bestSeason} />
        <Field label="Avoid season" value={data.avoidSeason} />
        <Field label="Why avoid" value={data.avoidReason} />
        <Field label="Weather" value={data.weatherConditions} />
      </>;
    case 'budgetReview':
      return <>
        <Field label="Planned budget" value={data.plannedBudget && `Rs ${data.plannedBudget}`} />
        <Field label="Actual spend" value={data.actualSpend && `Rs ${data.actualSpend}`} />
        <Field label="Emergency buffer needed" value={data.emergencyBufferNeeded && `Rs ${data.emergencyBufferNeeded}`} />
        <Field label="Hidden costs" value={data.hiddenCosts} />
      </>;
    case 'safetyTip':
      return <>
        <Field label="Wish they knew earlier" value={data.wishTheyKnewEarlier} />
        <Field label="Scams / risks" value={data.scamsOrRisks} />
        <Field label="Emergency contacts" value={data.emergencyContacts} />
      </>;
    default:
      return null;
  }
}

export default function ReviewSections({ review }) {
  const availableSections = SECTION_DEFS.filter((s) => review[s.key]);
  const [active, setActive] = useState(availableSections[0]?.key);

  if (availableSections.length === 0) {
    return <p style={{ color: 'var(--color-ink-soft)' }}>No structured sections filled in.</p>;
  }

  return (
    <div>
      <div className="tabs">
        {availableSections.map((s) => (
          <button key={s.key} className={active === s.key ? 'active' : ''} onClick={() => setActive(s.key)}>
            {s.label}
          </button>
        ))}
      </div>
      <SectionBody sectionKey={active} data={review[active]} />
    </div>
  );
}
