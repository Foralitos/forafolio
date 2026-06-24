import { PrimaryButton } from 'forafolio';

export const Default = () => (
  <PrimaryButton to="/contact">Get in touch</PrimaryButton>
);

export const WithoutArrow = () => (
  <PrimaryButton to="/projects" showArrow={false}>View projects</PrimaryButton>
);
