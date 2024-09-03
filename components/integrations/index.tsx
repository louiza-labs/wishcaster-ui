"use client"

import useIntegrations from "@/hooks/integrations/useIntegrations"
import IntegrationsCard from "@/components/integrations/IntegrationsCard"

const Integrations = () => {
  const { integrationOptions, connectedIntegrationImages } = useIntegrations()

  return (
    <div className="flex  flex-col items-center justify-start gap-y-10 overflow-y-scroll ">
      <div className=" grid  w-full flex-wrap justify-center lg:grid-cols-2 lg:gap-10">
        {integrationOptions.map((integration: any) => (
          <IntegrationsCard
            title={integration.label}
            description={integration.description}
            image={integration.image}
            handleClick={integration.onClick}
            isConnected={integration.isConnected}
            key={integration.label}
            featuresList={integration.features}
          />
        ))}
      </div>
    </div>
  )
}

export default Integrations
