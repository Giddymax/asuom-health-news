import { DonationForm } from "@/components/site/donation-form";
import { Container } from "@/components/ui/container";
import { getActiveDonationCampaign } from "@/lib/repositories/cms-repository";
import { formatMoney } from "@/lib/utils";

export default async function DonatePage() {
  const campaign = await getActiveDonationCampaign();
  const progress = Math.round((campaign.raisedAmount / campaign.goalAmount) * 100);

  return (
    <main>
      <section className="simple-hero">
        <Container>
          <span className="eyebrow">{campaign.kicker}</span>
          <h1>{campaign.title}</h1>
          <p>{campaign.description}</p>
        </Container>
      </section>
      <Container className="donation-layout">
        <div className="surface-elevated donation-summary">
          <div className="donation-metric">
            <strong>{formatMoney(campaign.raisedAmount)}</strong>
            <span>Raised</span>
          </div>
          <div className="donation-metric">
            <strong>{formatMoney(campaign.goalAmount)}</strong>
            <span>Goal</span>
          </div>
          <div className="donation-metric">
            <strong>{progress}%</strong>
            <span>Funded</span>
          </div>
          <div className="donation-metric">
            <strong>{campaign.paymentNumber}</strong>
            <span>{campaign.paymentLabel}</span>
          </div>
        </div>
        <div className="surface-elevated">
          <DonationForm paymentLink={campaign.paymentLink} />
        </div>
      </Container>
    </main>
  );
}
