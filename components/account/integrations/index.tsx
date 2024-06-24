"use client"

import useIntegrations from "@/hooks/integrations/useIntegrations"
import IntegrationsCard from "@/components/account/integrations/IntegrationsCard"

const Integrations = () => {
  const { integrationOptions, connectedIntegrationImages } = useIntegrations()

  return (
    <div className="flex w-full flex-col items-center justify-start gap-y-10 ">
      <div className=" grid  w-full flex-wrap justify-center lg:grid-cols-4 lg:gap-10">
        {integrationOptions.map((integration: any) => (
          <IntegrationsCard
            title={integration.label}
            description={integration.description}
            image={integration.image}
            handleClick={integration.onClick}
            isConnected={integration.isConnected}
            key={integration.label}
          />
        ))}
      </div>
    </div>
  )
}

export default Integrations
