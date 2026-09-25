/**
 * Tier 0 definitions - pages built directly from Google Search Console
 * impressions (SEO-PLAN.md "Tier 0 - GSC data"). These queries already earn
 * impressions with near-zero clicks, mostly via the legacy blog archive; each
 * one now has a dedicated, honest target page.
 */
import type { DefinitionEntry } from "./definitions";

export const DEFINITIONS_GSC: DefinitionEntry[] = [
  {
    slug: "what-is-an-open-source-cloud-management-platform",
    term: "What is an Open Source Cloud Management Platform?",
    summary:
      "What an open source cloud management platform does, how it differs from the clouds it manages, and where an open control plane like Waldur fits.",
    group: "Open source & hybrid cloud",
    media: "open-source-screen",
    mediaCaption: "The control plane, in the open.",
    sections: [
      {
        paragraphs: [
          "A cloud management platform is software that provisions, governs and meters cloud resources - across providers, regions and teams - from a single control plane. An <strong>open source cloud management platform</strong> does the same job with source you can read, host yourself and extend, instead of renting it from a single vendor.",
          "The distinction that matters: this software does not <em>be</em> the cloud. It operates clouds that already exist - publishing catalogues, onboarding users, tracking quotas, starting and stopping workloads, and turning consumption into bills. If the clouds are the machines, the management platform is the layer that sells and schedules time on them.",
        ],
      },
      {
        heading: "What a management platform actually manages",
        paragraphs: ["A platform in this category typically takes responsibility for:"],
        list: [
          "A service catalogue - what is offered, to whom, at what price or quota.",
          "User and project lifecycle - sign-up, approval, allocation, off-boarding.",
          "Workload lifecycle - create, start, stop, resize and delete across backends.",
          "Metering and cost visibility - what was consumed, by whom, for how long.",
          "Backend connectors - the adapters that speak to each cloud it operates.",
        ],
        after: [
          "That last point is the strategic one: connectors are what let one control plane sit above OpenStack, Kubernetes, VMware, bare metal and public cloud accounts at the same time.",
        ],
      },
      {
        heading: "Management platform versus cloud platform",
        paragraphs: [
          "The two terms are easy to confuse. An <a href=\"/definitions/what-is-an-open-source-cloud-platform\">open source cloud platform</a> is the infrastructure software you run to <em>have</em> a cloud - compute, storage and networking APIs on hardware you control. A management platform sits above clouds, whatever runs them, and handles the commercial and operational layer: catalogue, users, lifecycle and billing. A provider often runs both - the platform underneath, the management layer facing tenants.",
        ],
      },
      {
        heading: "Why open source matters here",
        paragraphs: [
          "Management platforms see your credentials, your users and your billing rules. Open source lets an operator verify what the software does with that access, host it inside their own boundary, and extend it when a backend or a business rule is not on anyone's roadmap. For a marketplace - where the operator is not a single trusted vendor but a network of participants - that auditability is not a preference, it is part of the trust model.",
        ],
      },
      {
        heading: "Catalogue, orders, resources",
        paragraphs: [
          "Every management platform in this category is built around a small set of recurring objects: a catalogue of offerings, orders that request them, the resources those orders create, and the accounting that follows those resources over their life. Waldur names them explicitly - offerings, orders, resources and accounting - because the shared vocabulary is what keeps a multi-tenant control plane legible to everyone reading it.",
          "The point of naming them is that each object keeps a stable identity across systems: an order that becomes a resource can be followed through provisioning, usage and settlement without translating between three private schemas along the way.",
        ],
        list: [
          "Offerings - what a provider publishes: the service, its plan and its terms.",
          "Orders - requests for an offering, routed through approvals when a project requires them.",
          "Resources - the live things an order produces, tracked until they are released.",
          "Accounting - the record of what each resource consumed, for chargeback or review.",
        ],
        after: [
          "That sequence is deliberately the same shape for a virtual machine, an HPC project or a SaaS entitlement: one lifecycle, many fulfilment backends.",
        ],
      },
      {
        heading: "Where the control plane stops",
        paragraphs: [
          "A control plane is honest about its boundary. It schedules and records, but it does not make backends healthy: an API that provisions capacity depends on the capacity actually existing underneath, and no catalogue changes that. Operators evaluate the software and the infrastructure separately for exactly this reason.",
          "The boundary runs the other way too. The platform holds credentials and policy, so the responsibility attached to it is proportionate - who may approve what, which backends are reachable, and how every action is recorded. On VirtEngine that record is not only internal: the chain keeps the settlement-relevant parts of the lifecycle verifiable by both sides rather than by the platform's own say-so.",
        ],
      },
      {
        heading: "Waldur as an open control plane",
        paragraphs: [
          "VirtEngine uses <a href=\"/waldur\">Waldur</a> as its primary marketplace and service-management integration: the open control plane where providers publish offerings and tenants consume services, connected to the chain through the provider daemon. Management-level actions become durable commands the adapter executes in Waldur, and their results flow back as chain state - so an open management platform is not a competitor to the marketplace, it is the surface the marketplace is exposed through.",
        ],
      },
    ],
    faq: [
      {
        question: "How does a cloud management platform differ from a cloud platform?",
        answer:
          "A management platform operates clouds - catalogue, users, lifecycle, billing - while a cloud platform is the infrastructure software that provides the cloud itself. The management layer sits above whatever platforms it connects to.",
      },
      {
        question: "What does open source change for an operator?",
        answer:
          "You can audit what touches your credentials and users, host the control plane inside your own boundary, and extend it when a backend or rule is unsupported. It removes dependence on a single vendor for the layer that sees the most sensitive access.",
      },
      {
        question: "Can one management platform control several clouds?",
        answer:
          "That is the point of the category: backend connectors let a single control plane operate OpenStack, Kubernetes, VMware, bare metal and public cloud accounts together, presenting one catalogue and one bill to users.",
      },
      {
        question: "How does Waldur relate to VirtEngine?",
        answer:
          "Waldur is VirtEngine's primary marketplace and service-management integration. Providers operate it as their control plane; the provider daemon bridges its actions and usage to the chain for matching, escrow and settlement.",
      },
    ],
    related: [
      "what-is-an-open-source-cloud-platform",
      "what-is-private-cloud-software",
      "what-is-an-open-source-hybrid-cloud",
      "what-is-openstack",
    ],
    funnel: { label: "See the Waldur integration", href: "/waldur" },
    practice:
      "A datacenter operator runs Waldur as the open control plane and reaches VirtEngine's tenants through it - one catalogue, one settlement rail.",
  },
  {
    slug: "what-is-an-open-source-cloud-platform",
    term: "What is an Open Source Cloud Platform?",
    summary:
      "The software you run to operate a cloud yourself: what an open source cloud platform includes, how it differs from managed cloud, and how providers connect it to a marketplace.",
    group: "Open source & hybrid cloud",
    media: "hero-infrastructure",
    mediaCaption: "The cloud you run, on hardware you control.",
    sections: [
      {
        paragraphs: [
          "An <strong>open source cloud platform</strong> is the software stack you install on your own infrastructure to run a cloud: APIs for compute, storage and networking, tenancy and isolation, image and volume management, and a self-service layer on top. OpenStack, Apache CloudStack and OpenNebula are the established names in the category; all three are open source, so the cloud you operate is built from software you can inspect and modify.",
          "The defining property is control. With a managed cloud you rent the outcome; with an open source platform you own the operation - the hardware, the upgrades, the scheduling policy and the API surface. That control is exactly why providers and research sites run them, and exactly why operating one well is real work.",
        ],
      },
      {
        heading: "What the stack includes",
        paragraphs: ["A platform in this category is a set of cooperating services rather than a single binary:"],
        list: [
          "Compute - the API that creates and destroys virtual machines, and the hypervisor underneath them.",
          "Storage - block volumes, object stores and the network that attaches them to workloads.",
          "Networking - virtual networks, routing and isolation between tenants.",
          "Identity and quota - who may create what, in what amounts.",
          "A dashboard or API for self-service on top of all of it.",
        ],
      },
      {
        heading: "Versus managed cloud",
        paragraphs: [
          "Managed cloud converts capital expense into operating expense and hands operations to someone else. An open source platform reverses that trade: lower recurring cost and full control, in exchange for the engineering to run it - upgrades, capacity planning, security patching. Neither is categorically better; they answer different constraints. What has historically been missing is a third path: running your own cloud and still reaching demand you do not own - which is what a <a href=\"/definitions/what-is-a-compute-marketplace\">compute marketplace</a> provides.",
          "Where each side wins also depends on the estate. A single application with predictable load rarely justifies running a control plane of its own; fleets of steady, known workloads with compliance constraints are where owning one starts to earn back the operational layer it demands. Most estates end up mixed - which is the subject of the <a href=\"/definitions/what-is-an-open-source-hybrid-cloud\">open source hybrid cloud</a> definition.",
        ],
      },
      {
        heading: "From virtualization cluster to cloud",
        paragraphs: [
          "The hardware rarely makes something a cloud. A room full of hypervisors is a virtualization cluster: machines are allocated by tickets and spreadsheets, images are copied by hand, and network changes go through whoever owns the switches. The platform is what replaces those tickets with an API.",
          "Once consumers can request capacity themselves - from a catalogue, within quota, against pre-approved images - the same metal behaves like a cloud. This is also why two deployments of the same open source project can feel completely different to their users: the difference lives in how the self-service layer, tenancy model and network policy are configured, not in which services were installed.",
          "There is a middle setting, too. Some operators keep only the control plane - API, identity, images, quota - running on leased metal, so the policy layer stays theirs while the hardware is rented. What defines the category is where control of the cloud sits: with whoever runs the software.",
        ],
      },
      {
        heading: "What running one involves",
        paragraphs: [
          "Owning the operation is the trade the platform asks for. Upgrades move several cooperating services together and have to respect API compatibility for anything already running. Capacity needs headroom for failure, not only for growth. Security patches arrive on the operating system's schedule, not the platform's.",
        ],
        list: [
          "Upgrade coordination between services, with a rollback path kept open.",
          "Capacity headroom sized for hardware failure as well as demand peaks.",
          "Monitoring across control plane and data path, not only host utilisation.",
          "Operators comfortable with distributed systems when the stack misbehaves.",
        ],
        after: [
          "Distribution-backed builds soften the edges with tested packaging and support channels, but the underlying lifecycle is still yours to schedule. Teams buying their first cloud are usually better served renting until the workloads justify carrying that operational layer themselves.",
        ],
      },
      {
        heading: "From platform to marketplace",
        paragraphs: [
          "A provider running an open source cloud platform can expose its capacity to outside tenants without rebuilding its stack. Waldur already documents provider modules for OpenStack, Kubernetes, Rancher and VMware among others, and the provider daemon connects that control plane to VirtEngine: offerings are published, orders become leases, usage is metered, and settlement happens on-chain. The platform stays yours; the demand side becomes open.",
        ],
      },
    ],
    faq: [
      {
        question: "What is the difference between a cloud platform and a cloud management platform?",
        answer:
          "A cloud platform provides the cloud itself - the compute, storage and networking APIs running on your hardware. A management platform operates clouds: catalogue, users, lifecycle and billing across one or more backends. See the management platform definition for the full split.",
      },
      {
        question: "Which open source cloud platforms exist?",
        answer:
          "The established open source cloud platforms are OpenStack, Apache CloudStack and OpenNebula, each providing compute, storage and networking APIs you run yourself. Kubernetes is commonly used alongside them for container workloads, though it is an orchestration layer rather than a full cloud platform.",
      },
      {
        question: "Do I need my own datacenter to run one?",
        answer:
          "You need infrastructure you control - an on-premise datacenter, colocation, or a set of dedicated servers. The platform runs on that hardware; what you give up versus managed cloud is the operational convenience, not just the invoice.",
      },
      {
        question: "How does VirtEngine relate to open source cloud platforms?",
        answer:
          "VirtEngine is a marketplace, not a platform. Providers running open source clouds connect them through the provider daemon and Waldur integration, so their capacity can be listed, ordered, metered and settled on-chain alongside any other backend.",
      },
    ],
    related: [
      "what-is-an-open-source-cloud-management-platform",
      "what-is-private-cloud-software",
      "what-is-openstack",
      "what-is-an-open-source-hybrid-cloud",
    ],
    funnel: { label: "For the operators running these clouds", href: "/solutions/datacenter-operators" },
    practice:
      "Capacity from a cloud you already run becomes a listing: the platform underneath stays untouched while the marketplace handles discovery, orders and payment.",
  },
  {
    slug: "what-is-private-cloud-software",
    term: "What is Private Cloud Software?",
    summary:
      "Private cloud software runs a cloud inside infrastructure you control. What the category includes, what operating it takes, and how renting private capacity compares.",
    group: "Open source & hybrid cloud",
    media: "provider-datacenter",
    mediaCaption: "Your racks, your boundary, your rules.",
    sections: [
      {
        paragraphs: [
          "<strong>Private cloud software</strong> is the infrastructure software that turns hardware you control - your datacenter, your colocation suite, your dedicated servers - into a cloud: a self-service environment with APIs, tenancy, metering and lifecycle, offered exclusively to your organisation or your customers. The hardware is private; the software is what makes it behave like a cloud rather than a set of machines.",
          "Most private cloud software is open source - OpenStack, Proxmox VE, CloudStack and OpenNebula are the familiar entries - because the buyers are operators who expect to inspect and extend the layer sitting closest to their metal. Vendor-backed distributions exist around the same projects for teams that want support contracts instead of source.",
        ],
      },
      {
        heading: "What the category includes",
        paragraphs: ["Evaluating private cloud software comes down to five capabilities:"],
        list: [
          "The virtualisation layer - the hypervisor and how it is driven.",
          "An API and portal - how workloads are created and who is allowed to create them.",
          "Tenancy and quota - how teams and projects are separated and limited.",
          "Metering - what was consumed, so chargeback or showback is possible.",
          "Integration points - identity, storage, network and backup systems it plugs into.",
        ],
        after: [
          "A sixth question cuts across all of them: how the platform reports consumption. Without metering, chargeback is guesswork - and a private cloud that cannot say what a project consumed behaves like a cost centre with an API.",
        ],
      },
      {
        heading: "Deployment models",
        paragraphs: [
          "The software is the same across settings; what changes is where the racks sit and who walks to them. Private cloud software is deployed in three common shapes:",
        ],
        list: [
          "On-premise - the platform runs in a datacenter the organisation owns and staffs.",
          "Colocation - own hardware, own platform, a facility and network someone else operates.",
          "Hosted single-tenant - a provider operates dedicated infrastructure for one customer under contract, often called managed private cloud.",
        ],
        after: [
          "Each shape moves operational chores between in-house teams and a provider without moving control of the cloud layer: the tenancy, quota and image policy still belong to whoever operates the platform in that arrangement.",
        ],
      },
      {
        heading: "Source, distribution or support",
        paragraphs: [
          "Because most of the category is open source, buying private cloud software is not one decision but two. The first is upstream: pick the project and accept its release cadence. The second is how much scaffolding to put around it - self-built packaging and runbooks, or a distribution that charges for tested builds, security backports and someone to call.",
          "Neither route changes what the software does; they change who absorbs the undifferentiated work - upgrade testing, vulnerability triage, compatibility verification - and on whose timeline. Operators with mature platform teams routinely run upstream alone; regulated environments often prefer a supported distribution precisely so the maintenance story has a named owner.",
          "The same question reappears at the hardware layer. Platform releases state the virtualisation and storage versions they support, so fleets drift toward combinations the project has tested; validating that matrix before an upgrade is unglamorous, unavoidable work in every arrangement described above.",
          "Either way, the licence is not the cost centre: open source removes the purchase order, not the platform team. Buyers comparing options get further asking who will be running this in two years than asking what the software costs to download.",
        ],
      },
      {
        heading: "Build versus rent private capacity",
        paragraphs: [
          "Running private cloud software means owning the lifecycle: procurement, upgrades, capacity headroom, and the people who keep it healthy. The alternative on the other side of the spectrum is renting private capacity from a provider - the same isolation without the operational ownership. Between them sits a useful middle: operators can offer single-tenant private capacity to the open market, and tenants can order it like any other listing. On VirtEngine, <a href=\"/marketplace/iaas\">IaaS listings</a> can express reserved capacity, dedicated quotas and network isolation, so a private cloud can be bought rather than built - or built, and then sold.",
        ],
      },
      {
        heading: "Where identity fits",
        paragraphs: [
          "Private infrastructure narrows the trust boundary but does not remove the need to know who is inside it. On VirtEngine, both sides of a private-capacity order are VEID-verified before matching, and payment runs through escrow - so the software question and the counterparty question are answered together rather than one being left to a contract.",
          "The same discipline applies inside the boundary: provider technicians and tenant administrators hold distinct roles, and a private cloud worth operating treats those roles as platform objects with their own permissions - not as shared credentials on a jump host.",
        ],
      },
    ],
    faq: [
      {
        question: "What is the difference between private cloud and on-premise hosting?",
        answer:
          "On-premise hosting gives you machines; private cloud software adds the cloud layer - self-service API, tenancy, metering and lifecycle. You can have a datacenter without a private cloud, but not a private cloud without infrastructure you control.",
      },
      {
        question: "Is private cloud software always open source?",
        answer:
          "No, but most of the category is open source - OpenStack, Proxmox VE, CloudStack and OpenNebula are the familiar entries - often with vendor-backed distributions offering support around the same projects.",
      },
      {
        question: "Can private capacity be rented instead of built?",
        answer:
          "Yes. Providers can list single-tenant private capacity with reserved quotas and network isolation as an IaaS listing, and tenants order it through the marketplace with escrow-backed payment instead of owning the stack.",
      },
      {
        question: "How does VEID apply to private cloud?",
        answer:
          "Both counterparties are identity-verified before a private-capacity order matches. A private boundary narrows who is inside it; VEID establishes who they actually are before the lease begins.",
      },
    ],
    related: [
      "what-is-an-open-source-cloud-platform",
      "what-is-an-open-source-hybrid-cloud",
      "what-is-bare-metal",
      "what-is-an-open-source-cloud-management-platform",
    ],
    funnel: { label: "Private capacity as a listing", href: "/marketplace/iaas" },
    practice:
      "A provider with isolated racks lists them as reserved IaaS capacity; a tenant gets private cloud without owning the software lifecycle.",
  },
  {
    slug: "what-is-an-open-source-hybrid-cloud",
    term: "What is an Open Source Hybrid Cloud?",
    summary:
      "An open source hybrid cloud links privately run infrastructure with rented capacity. How the pattern works, what it solves, and how adapters keep both sides manageable.",
    group: "Open source & hybrid cloud",
    media: "network-earth",
    mediaCaption: "One workload, two boundaries.",
    sections: [
      {
        paragraphs: [
          "A <strong>hybrid cloud</strong> connects infrastructure you operate with capacity you rent, so workloads can move or span between them. An <strong>open source hybrid cloud</strong> builds that connection with open tooling - open source platforms on the private side, open APIs and connectors across the seam - rather than tying both ends to one vendor's proprietary control plane.",
          "The word that earns its keep is <em>and</em>. Not private <em>or</em> public, but both: the datacenter you own handling steady state and sensitive workloads, rented capacity absorbing bursts, specialised hardware or regional demand. The hard part is never the two halves - it is the connection between them.",
        ],
      },
      {
        heading: "What makes a cloud hybrid",
        paragraphs: ["Three conditions separate a genuine hybrid setup from simply running two clouds:"],
        list: [
          "Workloads can be placed on either side by policy, not by manual migration projects.",
          "One operational pattern - images, networking, identity - is understood across both.",
          "Consumption is visible in one place, so capacity decisions use real data.",
        ],
        after: [
          "Open source tooling is unusually good at the middle condition, because the connectors are inspectable instead of being a black box owned by whichever vendor wrote them.",
        ],
      },
      {
        heading: "Common patterns",
        paragraphs: [
          "Hybrid architecture has a short list of recurring shapes. They usually appear together, because they answer the same pressure - capacity that changes faster than procurement does:",
        ],
        list: [
          "Bursting - steady load on private infrastructure, peaks served by rented capacity.",
          "Data tiering - active data kept close to compute, archives placed where holding them costs least in effort.",
          "Split by constraint - workloads placed by latency, residency or assurance rules rather than by convenience.",
          "Spare capacity sold - private infrastructure exposed outward so idle headroom earns instead of waiting.",
        ],
        after: [
          "Bursting gets the headlines, but the split-by-constraint pattern is the one that makes hybrid permanent: some workloads never move again once the rule is written down.",
        ],
      },
      {
        heading: "How both sides stay coherent",
        paragraphs: [
          "Spanning two environments only works if they understand each other. Images must be movable, or rebuilt identically. Networks must reach across the seam without becoming a flat free-for-all. Identity has to mean the same thing on both sides, so a person or service is one subject rather than two unrelated accounts.",
          "Consistency at that level is difficult to extract from a single vendor's console, which is precisely why open tooling carries weight here: the glue is inspectable, versionable and testable like any other code the organisation runs.",
        ],
      },
      {
        heading: "Where hybrid tends to break",
        paragraphs: [
          "Most hybrid failures are seam failures. Identity diverges until one side authenticates subjects the other has already revoked. Images fork quietly, and a fix deployed in one environment never reaches the other. Network rules accrete on both sides until nobody can say with confidence what traffic is meant to be allowed.",
          "The antidote is unglamorous: the seam gets an owner, drift is surfaced instead of tolerated, and the integration layer is treated as production code with its own tests and its own releases - which is another way of describing the adapter discipline the following section formalises.",
        ],
      },
      {
        heading: "Design constraints",
        paragraphs: [
          "Three forces shape where workloads end up. Data gravity - workloads stay near the stores they chew through, and moving compute is easier than moving data. Latency - round-trips across the seam are real time that interactive paths may not have. And the practical one: every boundary between environments is another place configuration can drift.",
          "None of these are fixed by a good architecture diagram; they are managed by policy that both sides actually execute. An execution layer that can act on both backends under one set of rules is exactly what the next section is about.",
        ],
      },
      {
        heading: "The adapter problem",
        paragraphs: [
          "Every hybrid architecture eventually becomes a question of adapters: how the private platform, the rented backends and the organisational layer speak to each other. This is where <a href=\"/waldur\">Waldur</a> does concrete work for VirtEngine - it documents provider modules for OpenStack, Kubernetes, Rancher, VMware and others, and its site-agent capability is how a backend becomes a managed integration. One control plane above heterogeneous backends is what makes hybrid an operating model instead of a diagram.",
        ],
      },
      {
        heading: "Hybrid as a marketplace posture",
        paragraphs: [
          "There is a commercial version of hybrid, too. An operator keeps private infrastructure for what must stay in-house, and rents the rest - from other providers, on the open market - instead of over-provisioning for peak. On VirtEngine that renting is escrow-backed and metered like any other lease, so the hybrid line moves with demand rather than with a procurement cycle.",
        ],
      },
    ],
    faq: [
      {
        question: "What is the difference between hybrid cloud and multi-cloud?",
        answer:
          "Hybrid cloud specifically links private infrastructure you operate with rented capacity under one operating pattern. Multi-cloud means using several providers, which may or may not include your own infrastructure - you can have multi-cloud without hybrid, and hybrid with a single external provider.",
      },
      {
        question: "Does a hybrid cloud require Kubernetes?",
        answer:
          "No. Kubernetes is one common way to run a consistent workload layer across environments, but hybrid architecture starts with the connection between backends - adapters, identity and metering - which can be built on other tooling.",
      },
      {
        question: "What does open source contribute to a hybrid cloud?",
        answer:
          "Inspectable connectors on both sides of the seam. Open tooling keeps the integration layer auditable and portable, so neither end of the hybrid is locked to the vendor that wrote the bridge between them.",
      },
      {
        question: "How does VirtEngine fit into a hybrid architecture?",
        answer:
          "VirtEngine adds an open market for the rented side: providers expose capacity through Waldur and the provider daemon, tenants order it through escrow-backed leases. The private side stays yours; only the connection and the settlement are protocol-level.",
      },
    ],
    related: [
      "what-is-an-open-source-cloud-platform",
      "what-is-private-cloud-software",
      "what-is-openstack",
      "what-is-an-open-source-cloud-management-platform",
    ],
    funnel: { label: "The integration that connects backends", href: "/waldur" },
    practice:
      "Steady state stays on the private platform; bursts go to rented capacity - both scheduled through one control plane with one bill.",
  },
  {
    slug: "what-is-openstack",
    term: "What is OpenStack?",
    summary:
      "OpenStack is open source software for running cloud infrastructure: compute, storage and networking APIs. What it provides, how it relates to KVM, and how it connects outward.",
    group: "Open source & hybrid cloud",
    media: "open-source-screen",
    mediaCaption: "Cloud infrastructure, assembled in the open.",
    sections: [
      {
        paragraphs: [
          "<strong>OpenStack</strong> is an open source cloud infrastructure project - a set of cooperating services that expose compute, storage and networking as APIs, so organisations can run their own cloud the way a provider does. It is the most established entry in the <a href=\"/definitions/what-is-an-open-source-cloud-platform\">open source cloud platform</a> category, deployed in universities, research facilities, telcos and enterprise datacenters.",
          "OpenStack is not a product you install once. It is a stack you operate: services that talk to each other, hardware underneath, and an upgrade cadence you commit to. That operational reality is why its ecosystem includes distributions and management tooling rather than only the raw projects.",
        ],
      },
      {
        heading: "What OpenStack provides",
        paragraphs: ["The core projects map directly onto the services a cloud must offer:"],
        list: [
          "Compute - the API that creates and destroys virtual machines.",
          "Block storage - persistent volumes attached to those machines.",
          "Object storage - a scalable store for images, backups and unstructured data.",
          "Networking - virtual networks, routing and isolation between tenants.",
          "Identity - who may create what, which underpins quota and tenancy.",
        ],
        after: [
          "Beyond the core, the surrounding ecosystem fills in the edges - load balancing, DNS, bare-metal provisioning, telemetry - so a deployment grows services the way it grows capacity: incrementally, and only where the need has actually shown up.",
        ],
      },
      {
        heading: "How a request flows through OpenStack",
        paragraphs: [
          "Under the APIs, a boot request is a relay between services rather than one program starting a machine. The compute API validates the request and asks the scheduler which host has room; the scheduler answers from its view of resources; the chosen host starts the virtual machine through the hypervisor, while identity confirms the caller was allowed to ask at all.",
          "Storage and networking join by attachment: a volume is created in the block service and connected to the instance, a port is allocated on the virtual network, addresses are handed out. The services coordinate through the message bus and database, which is why they are deployed, upgraded and monitored as a set rather than as independent tools.",
          "Because the flow crosses service boundaries, failure modes do too: a request can fail after authentication but before scheduling, or come up running while a volume attachment fails later. Operators debug this by correlating across services - which is why request identifiers are threaded through every log line in between.",
        ],
      },
      {
        heading: "KVM and OpenStack",
        paragraphs: [
          "The two are often named together because they layer cleanly: <strong>KVM</strong> is the kernel-level hypervisor that actually runs virtual machines on Linux, while <strong>OpenStack</strong> is the cloud control plane that exposes those machines as an API with tenancy, images, networks and quota around them. KVM is to OpenStack what an engine is to a fleet-management system - necessary underneath, insufficient alone to be a cloud. A KVM host becomes cloud infrastructure when OpenStack (or something equivalent) gives it self-service, metering and lifecycle.",
        ],
      },
      {
        heading: "OpenStack and hybrid cloud",
        paragraphs: [
          "OpenStack is a natural anchor for the private half of a hybrid architecture: it holds the steady-state and sensitive workloads, while rented capacity covers peaks and specialised needs. The integration question is how the OpenStack side and the external side are operated together - which is the <a href=\"/definitions/what-is-an-open-source-hybrid-cloud\">open source hybrid cloud</a> problem, and why adapter layers that speak to OpenStack natively matter more than another dashboard.",
        ],
      },
      {
        heading: "Running it well",
        paragraphs: [
          "Operating the stack well is mostly discipline around change. Services release together but may lag each other within a supported window, upgrades must preserve running instances, and the control plane itself needs redundancy - API, scheduler and database sit on the critical path of every request.",
        ],
        list: [
          "Upgrade sequencing with compatibility checks before the first service moves.",
          "Control plane components deployed redundantly - they are the critical path.",
          "Quota and scheduling policy tuned so one noisy tenant cannot starve the fleet.",
          "Telemetry kept on, because capacity planning without usage data is guessing.",
        ],
        after: [
          "Distributions package the same services together with their own upgrade tooling and tested paths; whichever route an operator takes, the operational profile above does not change.",
        ],
      },
      {
        heading: "Connecting OpenStack capacity outward",
        paragraphs: [
          "For a provider, an OpenStack cloud is already a cloud - the missing piece is reach. Waldur documents an OpenStack provider integration, and through the provider daemon that control plane connects to VirtEngine: offerings are published, orders become leases, usage is metered and settlement happens on-chain. The cluster keeps its operational model; the demand side stops being limited to whoever already knows about it.",
        ],
      },
    ],
    faq: [
      {
        question: "Is OpenStack the same as Kubernetes?",
        answer:
          "No. OpenStack provides cloud infrastructure APIs - virtual machines, volumes, networks - while Kubernetes orchestrates containers on top of infrastructure. They are frequently deployed together: OpenStack underneath, Kubernetes workloads on top, or Kubernetes clusters managed as OpenStack resources.",
      },
      {
        question: "What does KVM have to do with OpenStack?",
        answer:
          "KVM is the hypervisor OpenStack typically uses to run virtual machines. KVM provides the virtualisation on a Linux host; OpenStack adds the cloud API, tenancy, images, networking and quota that turn those VMs into a usable cloud.",
      },
      {
        question: "Can OpenStack run a hybrid cloud?",
        answer:
          "Yes - OpenStack commonly anchors the private side of a hybrid architecture, with policy and adapter tooling connecting it to rented external capacity. The hybrid question is really about what operates both sides together, not about OpenStack itself.",
      },
      {
        question: "How does a marketplace use an OpenStack cloud?",
        answer:
          "Through an integration. Waldur documents an OpenStack provider module, and the provider daemon bridges it to VirtEngine - so the OpenStack control plane keeps running workloads while the marketplace handles discovery, orders, metered usage and on-chain settlement.",
      },
    ],
    related: [
      "what-is-an-open-source-cloud-platform",
      "what-is-an-open-source-hybrid-cloud",
      "what-is-a-virtual-machine",
      "what-is-an-open-source-cloud-management-platform",
    ],
    funnel: { label: "OpenStack providers on the market", href: "/waldur" },
    practice:
      "An existing OpenStack deployment becomes a sellable backend: Waldur is the control plane, the provider daemon the bridge, the chain the ledger.",
  },
];
