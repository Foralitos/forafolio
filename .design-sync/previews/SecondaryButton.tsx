import { PrimaryButton, SecondaryButton } from 'forafolio';

export const Default = () => (
  <SecondaryButton to="/about">Learn more</SecondaryButton>
);

export const PairedWithPrimary = () => (
  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
    <PrimaryButton to="/contact">Get in touch</PrimaryButton>
    <SecondaryButton to="/about">Learn more</SecondaryButton>
  </div>
);
