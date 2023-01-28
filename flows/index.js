
const { onboardingFlow } = require("./onboarding/flow");
const { landlordFlow } = require("./landlord/flow");

const Flows = [
      onboardingFlow,
      landlordFlow
  ]
module.exports = {
    Flows
}