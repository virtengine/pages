/**
 * Tier 1 definitions - category heads (SEO-PLAN.md "Tier B"). These are the
 * established vocabulary queries where incumbent reference pages win the head;
 * each page defines one term on its own terms, carries the marketplace angle,
 * and hands the comparison or deep-dive queries to the page that owns them.
 */
import type { DefinitionEntry } from "./definitions";

export const DEFINITIONS_TIER_B: DefinitionEntry[] = [
  {
    slug: "what-is-iaas",
    term: "What is IaaS?",
    summary:
      "What is IaaS? Rented compute, storage and networking you configure yourself: the service model, its boundary, and how instances are listed.",
    group: "Service models",
    media: "hero-infrastructure",
    mediaCaption: "Racks down a data-centre aisle.",
    sections: [
      {
        paragraphs: [
          "<strong>Infrastructure as a Service (IaaS)</strong> is a cloud model in which a provider supplies compute, storage and networking over a network while the tenant runs its own workloads on top. What is rented is capacity - machines, volumes, addresses - rather than a finished application.",
          "The division of responsibility runs through the middle of the stack. The provider owns the hardware, the hypervisor, the power and the physical network; the tenant owns the operating system, its patches, the runtimes, the data and everything deployed above them. Because IaaS sits closest to owning machines, it is the model chosen when control of the software environment matters more than operational convenience.",
        ],
      },
      {
        heading: "What an infrastructure catalogue contains",
        paragraphs: ["A provider's IaaS offering is usually assembled from a handful of parts:"],
        list: [
          "Compute - virtual machines or dedicated hosts, described by processor count, memory, instance family and storage policy.",
          "Storage - volumes that outlive the machines they attach to, plus images, snapshots and backups.",
          "Networking - virtual networks, subnets, firewall rules, routing and addresses reachable from outside.",
          "Lifecycle controls - build from an image, start, stop, resize, snapshot, destroy, all through an API.",
          "Access and quota - credentials, project boundaries and per-user ceilings on what may be created.",
        ],
        after: [
          "Sitting under those parts is the control plane that turns an API call into a running machine. It holds the image catalogue, the network definitions, the quota rules and the live state of every instance it has created. Two providers can publish identical processor and memory shapes and still differ sharply in what that layer permits: which images exist, how networks are separated, how far an instance can grow without a rebuild, and how much of the API is exposed at all. Those are the details worth recording in a specification before a workload is migrated, because they decide whether the migration is a configuration change or a rewrite.",
          "Everything above that boundary stays with the tenant: patching the guest system, installing runtimes, deploying the application, protecting the data. That is the honest trade in this model. IaaS does not delete operational work, it relocates it, which is why teams renting infrastructure tend to buy back engineering time rather than headcount.",
        ],
      },
      {
        heading: "IaaS next to the other service models",
        paragraphs: [
          "IaaS is one of three labels commonly applied to what a cloud hands over, the others being <a href=\"/definitions/what-is-paas\">platform services</a> and <a href=\"/definitions/what-is-saas\">software delivered as a service</a>. This page stays with the first of them. The side-by-side reading of all three - what each takes off your plate, where the responsibility line moves, how the pricing behaves - lives in <a href=\"/learn/iaas-paas-saas-on-virtengine\">IaaS, PaaS and SaaS on VirtEngine</a>.",
          "The object a tenant actually works with is the <a href=\"/definitions/what-is-a-virtual-machine\">virtual machine</a>: an emulated computer with its own operating system running on shared hardware. Every instance in a listing is a defined shape of that object - a number of processors, an amount of memory, a starting image, a position on the network.",
        ],
      },
      {
        heading: "Who rents infrastructure, and what they check",
        paragraphs: [
          "IaaS suits workloads where the shape of the environment is part of the requirement: applications lifted from a datacenter that were never written for a platform service, clusters needing particular accelerators or interconnects, batch jobs that need machines for an afternoon, and deployments whose data must sit in a specific jurisdiction or network.",
          "What buyers compare reaches past the instance list. Transfer and storage policies often move the total cost as much as the hourly rate does; image availability and region placement decide whether a workload can move at all; and everything above the hypervisor becomes the tenant's security surface - a wider responsibility than a managed service hands over.",
        ],
      },
      {
        heading: "Infrastructure capacity on an open market",
        paragraphs: [
          "On VirtEngine, infrastructure appears as a published offering rather than a negotiated contract. A provider lists the instance shapes it will serve with their region, network characteristics and price, and a tenant funds an escrow account when placing the order. The provider can confirm committed budget before handing over a machine, and the tenant is not paying ahead for capacity it has not received.",
          "The order can match at the listed price, through competing bids, or by selecting listings that satisfy stated attributes; either way it becomes a lease binding tenant, provider and escrow. The provider's control plane fulfils the request, records what was consumed and signs those readings. Any VEID condition is specific to a supported offer and disclosed before ordering; it is not required for every marketplace transaction.",
        ],
      },
    ],
    faq: [
      {
        question: "What does IaaS stand for?",
        answer:
          "Infrastructure as a Service. It names the cloud model where rented compute, storage and networking are the product, while the operating system and everything above it stay under the tenant's control.",
      },
      {
        question: "What do you manage in an IaaS model?",
        answer:
          "You manage the guest operating system and its updates, runtimes, applications, data, and the firewall rules you configure. The provider manages the hardware, the virtualisation layer and the physical network underneath.",
      },
      {
        question: "How does IaaS differ from renting a physical server?",
        answer:
          "The machines are shared and capacity is requested through an API instead of a procurement cycle. You keep the same software-level control as with a dedicated server without owning or maintaining the equipment.",
      },
      {
        question: "How is IaaS billed on an open marketplace?",
        answer:
          "An order funds an escrow account, the matched lease runs against it, and the provider reports signed usage records that settle after a dispute window. Charges follow what was actually consumed rather than an upfront commitment.",
      },
    ],
    related: [
      "what-is-paas",
      "what-is-saas",
      "what-is-a-virtual-machine",
      "what-is-bare-metal",
      "what-is-a-compute-marketplace",
    ],
    funnel: { label: "IaaS listings on VirtEngine", href: "/marketplace/iaas" },
    practice:
      "A provider publishes instance shapes, region and price; a tenant orders one, funds escrow, and the provider is paid from that escrow only for usage that survives the dispute window.",
  },
  {
    slug: "what-is-paas",
    term: "What is PaaS?",
    summary:
      "What is PaaS? A cloud model where the provider runs the platform and you deliver code: what it covers, where the line sits, how it is listed.",
    group: "Service models",
    media: "open-source-screen",
    mediaCaption: "Source code on a laptop.",
    sections: [
      {
        paragraphs: [
          "<strong>Platform as a Service (PaaS)</strong> is a cloud model in which the provider runs the platform beneath an application - operating system, runtime, scaling machinery - while the tenant supplies code, configuration and data. The unit of work is a deployment, not a machine.",
          "That shift is the whole point of the model. A team using PaaS stops provisioning servers and starts shipping builds: patching, failover and capacity sit with the provider, while the team owns what the application does and how it behaves. PaaS trades some freedom over the environment for a much shorter path from source repository to running service, which is a good trade whenever the environment itself was never the differentiator.",
        ],
      },
      {
        heading: "What a platform takes off your plate",
        paragraphs: [
          "A PaaS offering is best read as a list of things nobody has to build:",
          "None of this makes the system underneath irrelevant. A tenant chasing a slow request still has to reason about the database it touches, the network path in between and the limits the platform enforces; the abstraction decides who repairs the machinery, not whether the machinery is involved. It also sets a ceiling on what may be changed: a platform that supports a fixed set of runtimes and add-ons will decline a requirement outside that set, and the refusal arrives as a product limitation rather than as a queue of work for your own team. Teams that read a platform as permission to stop thinking about infrastructure generally rediscover the boundary during their first serious incident, when the provider's support terms become the only question that matters.",
        ],
        list: [
          "Runtime environment - language runtimes and frameworks available without provisioning machines for them.",
          "Deployment path - a build from source, a container image, or a command that turns either into a running service.",
          "Backing services - databases, caches, queues and object stores bound to the application as dependencies.",
          "Scaling and recovery - instances restarted, balanced and grown by rules the platform enforces.",
          "Operations above the runtime - patching, certificate renewal and failover handled by the provider.",
        ],
        after: [
          "The price of that list is legibility. A PaaS tenant generally cannot point at the machine running a process, choose its kernel, or install a system-level agent - the platform abstracts those details away. When a workload needs one of them back, it usually moves down a level rather than fighting the abstraction.",
        ],
      },
      {
        heading: "Where PaaS sits",
        paragraphs: [
          "PaaS occupies the middle of the service-model stack: below <a href=\"/definitions/what-is-iaas\">infrastructure you configure yourself</a>, above software you simply use. The three are easy to confuse when they are described side by side, so the comparison itself is kept in one place - <a href=\"/learn/iaas-paas-saas-on-virtengine\">IaaS, PaaS and SaaS on VirtEngine</a> - while this page defines only the middle term.",
          "Two neighbours belong in the picture. Packaging the application as a <a href=\"/definitions/what-is-containerization\">container</a> is how most modern platforms receive deployments, and code that needs only an event handler can go one step further into <a href=\"/definitions/what-is-serverless\">serverless execution</a>. Both are adjacent to PaaS rather than replacements for it.",
        ],
      },
      {
        heading: "Teams that choose a platform, and teams that should not",
        paragraphs: [
          "PaaS fits product teams shipping frequently, organisations without the operations headcount to run infrastructure, and services whose value is the application logic rather than the machinery underneath. It is also a natural home for APIs, web front ends and back-end services that scale in the same shape as the traffic they serve.",
          "It fits less well when the workload dictates the environment: software needing an unusual kernel or device driver, long-running batch or numerical jobs, systems requiring specific network topologies, or teams bound by strict rules about which systems may process their data. Those constraints are worth discovering before a migration, not after it.",
        ],
      },
      {
        heading: "Platforms published as offerings",
        paragraphs: [
          "On VirtEngine a PaaS is something a provider can put on sale. The listing states what the platform includes - runtime versions, backing services, quotas, the size of the machines behind it - so a buyer can compare offers on contents rather than on marketing language. Placing the order opens an escrow account, which the provider can inspect before provisioning anything.",
          "Fulfilment routes the matched lease into the provider's control plane, where the project is created and its resource allocations are metered. Usage arrives as signed records, and once the dispute window closes the validated line items are taken from escrow, with unspent balance returning to the tenant. A provider may disclose a VEID requirement for a particular offer; many marketplace actions do not require VEID.",
        ],
      },
    ],
    faq: [
      {
        question: "What does PaaS stand for?",
        answer:
          "Platform as a Service. The provider runs the operating system, runtime and scaling machinery, while you deliver your own application code and data into that platform.",
      },
      {
        question: "What is the difference between PaaS and IaaS?",
        answer:
          "With IaaS you are given machines and manage everything on them; with PaaS you are given a deployment target and manage only the application. The boundary between the two is where the platform stops and your responsibility begins.",
      },
      {
        question: "Is container hosting a form of PaaS?",
        answer:
          "Usually yes. Managed container platforms provide a runtime, deployment path, scaling and backing services, which is the PaaS shape even when the underlying unit is a container rather than a virtual machine.",
      },
      {
        question: "How does a platform get sold on a marketplace?",
        answer:
          "As a listing that declares its contents and quotas. The tenant funds escrow when ordering, the provider provisions the project through its control plane, and metered usage settles against that escrow after a dispute window.",
      },
    ],
    related: [
      "what-is-iaas",
      "what-is-saas",
      "what-is-containerization",
      "what-is-serverless",
      "what-is-an-open-source-cloud-platform",
    ],
    funnel: { label: "PaaS listings on VirtEngine", href: "/marketplace/paas" },
    practice:
      "A managed platform appears as a catalogue entry whose runtime, quotas and price are stated up front; ordering funds escrow and the provider meters what the project draws from it.",
  },
  {
    slug: "what-is-saas",
    term: "What is SaaS?",
    summary:
      "What is SaaS? Software run by a provider and used over a network instead of installed: what it replaces, what you keep control of, how plans are sold.",
    group: "Service models",
    media: "learn-library",
    mediaCaption: "Library stacks seen from below.",
    sections: [
      {
        paragraphs: [
          "<strong>Software as a Service (SaaS)</strong> is a delivery model in which an application runs on the provider's own infrastructure and is used over a network - typically through a browser or a thin client - rather than installed on the machines of the people using it.",
          "In practice this means the vendor handles hosting, upgrades, availability and the storage behind the application, while users hold an account and work through an interface. Most services are multi-tenant, so one deployment serves many customers whose data is kept separate. What the customer buys is access under agreed terms: seats, usage, a plan tier, or some combination of the three.",
        ],
      },
      {
        heading: "What a subscription is actually buying",
        paragraphs: ["Strip a SaaS offering to its parts and it is a bundle of responsibilities:"],
        list: [
          "The application itself, delivered through a web interface or an API.",
          "The infrastructure and its operation - the customer never sees a server.",
          "Upgrades and fixes, applied by the vendor rather than scheduled by the customer.",
          "Identity and accounts - sign-in, roles, invitations, sometimes directory integration.",
          "Storage of the customer's data inside the service, on the vendor's terms.",
        ],
        after: [
          "The customer keeps the decisions that cannot be delegated: what data enters the system, who may see it, how it is classified, and whether it can be exported elsewhere. Those last two are the ones worth checking early, because the switching cost of a SaaS product is dominated by the work of extracting its data and re-teaching the people who use it.",
        ],
      },
      {
        heading: "SaaS beneath which sits what",
        paragraphs: [
          "SaaS is the top of the service-model stack: the customer consumes an outcome and operates none of the machinery. Below it, <a href=\"/definitions/what-is-paas\">platform services</a> hand you a deployment target, and <a href=\"/definitions/what-is-iaas\">infrastructure</a> hands you machines. Software teams building a product for others are usually building SaaS; the model distinctions matter most when you are deciding which layer to buy or to build on.",
          "For the side-by-side reading of the three levels - what each one takes on, where accountability moves, how the pricing differs - the comparison lives in <a href=\"/learn/iaas-paas-saas-on-virtengine\">IaaS, PaaS and SaaS on VirtEngine</a>. This page defines only the top term.",
          "SaaS is also how most people meet cloud computing without ever using the phrase: an account, a browser tab and a recurring charge form the entire visible surface, while the infrastructure, the platform and the people operating both stay behind the vendor's interface. That layering matters when something breaks. The support path runs to the provider for everything below the interface, and only configuration, data and access control remain in the customer's hands - which is a narrower set of levers than the phrase self-service suggests.",
        ],
      },
      {
        heading: "How software subscriptions are evaluated",
        paragraphs: [
          "Procurement conversations tend to circle the same questions. Can the data leave - what export formats exist, and does the API cover the same ground as the interface? Does it fit the organisation's identity system, or will accounts be managed by hand? Is the charge per person, per unit of consumption, or per tier, and what happens at the boundary between them?",
          "A separate class of questions concerns the vendor: where the data is held, who can access it, how the service is notified of failures, and what happens to the data when the contract ends. None of these are answered by the feature list, which is why they appear in the evaluation rather than the demo.",
          "Contracts add a second layer of the same questions. What happens to the data at the end of the term, whether the service can be paused, and which promises the product itself enforces - rather than an agreement enforceable only by complaint - are all worth reading for. A service whose export, access and deletion paths are built into the interface is materially easier to leave than one where they depend on a support queue, and ease of leaving is worth pricing in before adoption rather than after.",
        ],
      },
      {
        heading: "Software plans on an open market",
        paragraphs: [
          "A software plan behaves like a listing on VirtEngine. The provider publishes what the plan includes - entitlements, capacity components, support terms - so buyers compare contents directly instead of negotiating a private quotation. Ordering funds an escrow account first, and the fulfilment path for that lease activates the account on the provider's side.",
          "From there the same settlement rail applies as for any other lease: the provider reports entitlement and usage as signed records, validated line items are drawn from escrow after the dispute window, and any balance left when the deployment closes returns to the tenant. Payment risk is therefore bounded on both sides - see <a href=\"/learn/escrow-and-settlement-explained\">escrow and settlement</a> for the mechanics.",
        ],
      },
    ],
    faq: [
      {
        question: "What does SaaS stand for?",
        answer:
          "Software as a Service. The application runs on the provider's infrastructure and is used over a network, so the customer subscribes to access instead of installing and operating the software.",
      },
      {
        question: "What is the difference between SaaS and licensed software?",
        answer:
          "Licensed software is installed and run by the customer, who handles updates, capacity and availability. SaaS moves all of that to the provider; the customer manages accounts, configuration and data.",
      },
      {
        question: "Do I still own my data in a SaaS product?",
        answer:
          "Your organisation remains responsible for the data it puts into the service, but the vendor controls the systems storing it. That is why export capability, API coverage and deletion terms belong in the evaluation rather than the demo.",
      },
      {
        question: "How is a SaaS plan settled on a marketplace?",
        answer:
          "The plan is listed with its entitlements, the tenant funds escrow when ordering, and the provider activates the account against that lease. Metered or entitlement-based records settle from escrow after the dispute window.",
      },
    ],
    related: ["what-is-paas", "what-is-iaas", "what-is-serverless", "what-is-usage-based-billing"],
    funnel: { label: "SaaS listings on VirtEngine", href: "/marketplace/saas" },
    practice:
      "A software vendor lists a plan with its entitlements and terms; customers order it through escrow, so the subscription runs on a lease instead of a card payment.",
  },
  {
    slug: "what-is-serverless",
    term: "What is serverless computing?",
    summary:
      "What is serverless computing? Code run in short-lived executions by a cloud provider and billed while it runs: how it works, its limits, its listings.",
    group: "Service models",
    media: "provider-datacenter",
    mediaCaption: "Server racks in a provider hall.",
    sections: [
      {
        paragraphs: [
          "<strong>Serverless computing</strong> is a model in which a cloud provider runs application code in short-lived executions triggered by events, and charges only for the time those executions consume. The caller deploys a function or a handler; the provider decides where and how often it runs.",
          "The name is a statement about responsibility, not about hardware. Servers very much exist - they are simply somebody else's problem: allocation, patching, redundancy and idle capacity all sit with the provider. What remains for the developer is the code, its dependencies and the events it answers, which is why the model is often described as pricing execution rather than renting capacity.",
        ],
      },
      {
        heading: "How an execution works",
        paragraphs: ["A serverless deployment is a small number of moving parts:"],
        list: [
          "A trigger - an HTTP request, a queued message, a stored-object event, or a schedule.",
          "The package - the function and its dependencies, uploaded once and versioned.",
          "A lifetime - each invocation starts, runs, produces a result or a side effect, then stops.",
          "Limits - memory and a maximum duration, set per function and enforced by the platform.",
          "Outputs - a response, a record written elsewhere, or another event raised downstream.",
        ],
        after: [
          "Ephemeral execution is the design constraint behind all five. Nothing written to the local disk survives the next invocation, so state lives in databases, object stores or caches outside the function, and work that cannot finish inside the time limit has to be split or moved to a longer-running model. Cold starts - the first invocation after idle - are the latency cost of not owning the machines.",
        ],
      },
      {
        heading: "Where serverless fits, and where it stops",
        paragraphs: [
          "Event-driven glue suits the model well: webhooks, scheduled maintenance, image or document processing, API fronts behind bursty traffic, and coordination logic between services. The appeal is that a function handling rare events costs nothing while it waits, and no capacity planning is required for the quiet periods.",
          "It fits less well for long-running numerical work, tightly coupled cluster jobs, workloads needing specialised hardware or persistent high throughput, and anything that must hold a process open for hours. Those belong on <a href=\"/definitions/what-is-iaas\">machines you rent directly</a> or on a scheduled cluster. Packaging and moving between environments is simpler when the unit is a <a href=\"/definitions/what-is-containerization\">container</a>, which is how several platforms accept serverless-style deployments as well.",
          "Cost behaviour deserves its own note, because it inverts the usual worry. Nothing is reserved, so a quiet system costs close to nothing while a loop that never terminates bills itself without a ceiling unless someone set one. Budgets, alarms and per-function limits belong to the design of the deployment rather than to its administration, and the teams that skip them are the ones who discover the bill before the code.",
        ],
      },
      {
        heading: "Serverless inside the service models",
        paragraphs: [
          "Serverless is usually placed alongside <a href=\"/definitions/what-is-paas\">PaaS</a> rather than beside it: the provider operates even more of the stack, down to deciding where code executes. The trade is the same one, pushed further - more convenience and finer-grained billing in exchange for less control over placement, timing and the environment beneath the handler.",
          "Because billing follows execution rather than allocation, the model has different questions attached to it: what an invocation costs, how often a trigger fires, and what runaway looks like when a loop bills itself. For how the three traditional models compare, see <a href=\"/learn/iaas-paas-saas-on-virtengine\">IaaS, PaaS and SaaS on VirtEngine</a>.",
          "The same handler can be packaged and run on a container platform as well, which blurs the category in a useful way: what separates the options is who owns the idle time between executions. That question - reserving capacity in advance or paying only while code runs - is the same one a tenant answers whenever it moves between layers, and it is worth answering deliberately from the workload's shape rather than by adopting whichever option a project happened to start with.",
        ],
      },
      {
        heading: "Execution capacity as a listing",
        paragraphs: [
          "On VirtEngine, a serverless-style offering is published with its runtimes, limits and price per unit of execution spelled out, so a buyer can see what an event-heavy workload will cost before deploying it. The tenant funds an escrow account when ordering; the provider can verify that the budget exists before accepting the lease.",
          "Metering then follows the executions themselves: each invocation contributes a signed usage record, those records accumulate over the lease, and validated line items are taken from escrow once the dispute window closes. Spending is bounded by the escrow balance rather than by an open account. Any identity proof requirement depends on the selected offer and is disclosed before commitment.",
        ],
      },
    ],
    faq: [
      {
        question: "Does serverless mean there are no servers?",
        answer:
          "No. It means the servers belong to the provider rather than to you. Allocation, patching, redundancy and idle capacity are handled by the platform, leaving you responsible only for the code and its triggers.",
      },
      {
        question: "What is a cold start in serverless computing?",
        answer:
          "It is the extra latency on an invocation that arrives after a function has been idle, because the platform has to spin execution capacity back up. Applications with strict latency budgets address it with provisioned concurrency or by keeping the function warm.",
      },
      {
        question: "When is serverless the wrong choice?",
        answer:
          "For long-running jobs, tightly coupled cluster work, or workloads needing specialised hardware and sustained throughput. Serverless is built for short, event-driven executions, and forcing other shapes into it produces workarounds rather than savings.",
      },
      {
        question: "How is serverless usage metered on a marketplace?",
        answer:
          "Per execution: the platform records how long each invocation ran and reports those readings as signed usage records. They settle against the tenant's escrow after a dispute window, so billing tracks real consumption rather than reserved capacity.",
      },
    ],
    related: [
      "what-is-paas",
      "what-is-containerization",
      "what-is-usage-based-billing",
      "what-is-saas",
    ],
    funnel: { label: "Platform services on the market", href: "/marketplace/paas" },
    practice:
      "A provider offers event-driven handlers with published runtimes and limits; tenants escrow a budget up front and settle only the invocations their triggers actually produced.",
  },
  {
    slug: "what-is-ai-training",
    term: "What is AI training?",
    summary:
      "What is AI training? Fitting a model to data on accelerators: what a run needs, how it differs from inference, and where the capacity comes from.",
    group: "AI & GPU compute",
    media: "hpc-supercomputer",
    mediaCaption: "Compute cluster racks in a row.",
    sections: [
      {
        paragraphs: [
          "<strong>AI training</strong> is the process of fitting a model to data: the system reads examples, measures how wrong its predictions are, adjusts its internal parameters to correct them, and repeats the cycle until the result is acceptable for its intended use.",
          "Training is the costly half of a model's life. It runs for a long time, holds large volumes of data and intermediate state in memory, and rewards hardware that moves numbers quickly between devices - which is why accelerators and fast interconnects dominate this workload category. What the finished model does in production, answering requests one at a time, is a separate activity with separate economics.",
        ],
      },
      {
        heading: "What a training run needs",
        paragraphs: ["The requirements of a run are mostly physical, and they compound:"],
        list: [
          "Accelerators - multiple devices working as one, each with enough memory to hold its share of the model and working data.",
          "Interconnect - fast links between devices so partial results can be exchanged without stalling the job.",
          "Feeding and checkpointing - storage fast enough to stream datasets, and periodic saved state so a failure costs a restart rather than the run.",
          "A scheduler - queueing, allocating and restarting jobs across shared capacity.",
          "A staged plan - a small configuration validated first, then scale and variations added in later stages.",
        ],
        after: [
          "Staging exists because each step answers a cheaper question than the one after it: whether the data and code are correct can be settled on a small configuration, while scale only becomes worth paying for once the earlier answers hold. Jumps straight to the largest configuration tend to discover trivial mistakes at the highest price.",
        ],
      },
      {
        heading: "Training is not inference",
        paragraphs: [
          "<a href=\"/definitions/what-is-ai-inference\">Inference</a> is the other half of a model's life: running the trained weights against new input, per request, judged by latency and steadiness. Training runs offline in long blocks and is judged by the artefact it leaves behind. The two buy capacity differently - training wants a large block of devices for the duration of a run, while serving wants modest, continuously available capacity.",
          "That distinction is why listings separate them. Standing allocations with defined shapes are sold as <a href=\"/definitions/gpu-as-a-service\">GPU as a service</a>, and the marketplace carries both forms; see <a href=\"/marketplace/gpu-compute\">GPU compute listings</a> for the capacity side.",
          "Between training and serving sits evaluation: running the trained weights against held-out data and checking whether the result is fit to ship. It costs a fraction of the run that produced it and catches the failures that training alone cannot, because a model can fit its data closely and still behave badly on inputs nobody showed it.",
        ],
      },
      {
        heading: "Who buys training capacity",
        paragraphs: [
          "Typical buyers are research groups running experiments, teams adapting an existing model to their own domain, and organisations that need a run occasionally but cannot justify owning a cluster for it. Each arrives with constraints that are less about the accelerator model than about everything around it: where the training data may legally sit, how datasets and checkpoints will be staged, and how results will be reproduced.",
          "Scheduling is part of the decision too. Capacity that is cheap but queues for a long time suits experiments with flexible deadlines; capacity that starts immediately suits a run on a critical path. Both are rational purchases, and they are bought from different listings.",
          "Reproducibility is part of the purchase as well. A result that cannot be repeated from the same data and configuration is awkward to defend afterwards, so projects record the dataset, the software versions and the settings behind each attempt. That discipline grows harder, not easier, when a study cycles through several providers in sequence: an environment definition that travels with the job is what makes a claim checkable on unfamiliar hardware rather than merely plausible.",
        ],
      },
      {
        heading: "Training demand taken to the market",
        paragraphs: [
          "On an open market, training reaches providers as a stated requirement: how many accelerators, for how long, with what interconnect, and where the data may sit. The tenant funds an escrow account when placing that demand, so a provider can see real budget behind the request before it reserves devices for it.",
          "The matched lease binds tenant, provider and escrow, and fulfilment runs through the provider's control plane into its scheduler. Utilisation is reported as signed records, disputed if either side disagrees, and settled from escrow after the window closes with any unused balance returned. Any VEID requirement is specific to the selected offer, not a universal condition. The procurement side of this - what to plan for when buying such runs - is covered in <a href=\"/solutions/ai-ml-workloads\">AI and ML workloads</a>.",
        ],
      },
    ],
    faq: [
      {
        question: "What is AI training in simple terms?",
        answer:
          "It is the process that produces a model: the system works through data, measures its errors, adjusts its parameters, and repeats until the results are good enough. The output is the set of trained weights, not an answer to any single request.",
      },
      {
        question: "What is the difference between AI training and inference?",
        answer:
          "Training creates the model and runs offline in long blocks; inference uses the trained model and runs per request, online. Training wants a large block of accelerators for a limited period, while inference wants steady, smaller capacity.",
      },
      {
        question: "What hardware does AI training require?",
        answer:
          "Accelerators with sufficient memory, fast interconnect between them, storage that can stream datasets and hold checkpoints, and a scheduler to manage the jobs. The interconnect and checkpointing matter as much as the device count for runs of any size.",
      },
      {
        question: "How is training capacity bought on a marketplace?",
        answer:
          "A tenant states the requirement - device count, duration, interconnect, data location - and funds an escrow account with the order. Providers answer it, the match becomes a lease, and signed utilisation records settle against escrow after a dispute window.",
      },
    ],
    related: [
      "what-is-ai-inference",
      "gpu-as-a-service",
      "what-is-hpc",
      "what-is-slurm",
      "what-is-bare-metal",
    ],
    funnel: { label: "Training capacity on the market", href: "/solutions/ai-ml-workloads" },
    practice:
      "A training requirement is posted with device count, duration and data constraints; providers holding accelerators answer it, and the tenant's escrow pays out only for utilisation that is signed and uncontested.",
  },
  {
    slug: "what-is-hpc",
    term: "What is HPC (high-performance computing)?",
    summary:
      "What is HPC? High-performance computing joins many processors to finish large jobs faster: what clusters need, and how compute is bought per job.",
    group: "HPC",
    media: "hpc-supercomputer",
    mediaCaption: "Rows of racks on a cluster floor.",
    sections: [
      {
        paragraphs: [
          "<strong>High-performance computing (HPC)</strong> is the use of large numbers of processors, memory and storage, joined into a single system or cluster, to finish computational jobs that would be impractical on an ordinary machine.",
          "The work is typically numerical - simulation, modelling, rendering, risk analysis - and it splits into pieces that later have to exchange results. Two properties define the category: work is distributed across many nodes instead of running on one, and those nodes are connected by low-latency interconnects so that exchanging intermediate data does not become the slowest part of the job.",
        ],
      },
      {
        heading: "What a cluster is built from",
        paragraphs: ["HPC systems are assembled rather than bought as a unit:"],
        list: [
          "Compute nodes - machines with many cores and large memory footprints, frequently identical so jobs scale predictably across them.",
          "Interconnect - the fast fabric between nodes, on which tightly coupled jobs depend more than on anything else.",
          "Storage - parallel filesystems and scratch space sized to keep data near the nodes consuming it.",
          "A batch scheduler - the queue that admits jobs, allocates nodes and decides what runs next.",
          "Site services - power, cooling and physical access, which are operations rather than software but decide uptime all the same.",
        ],
        after: [
          "The hardware is the straightforward half. A cluster earns its keep when jobs arrive in a shape the scheduler can place: data staged close to compute, submissions written for the queue, failures expected and recovered from checkpoints rather than from the beginning.",
          "Two of those are habits rather than features. Staging data near compute and writing submissions for the queue are choices the submitting team makes, and they separate a cluster that stays busy from one that spends its day waiting on jobs that could have started hours earlier. Hardware does not compensate for either mistake; it simply makes the wait more expensive.",
        ],
      },
      {
        heading: "Why HPC workloads behave differently",
        paragraphs: [
          "Tightly coupled jobs need whole nodes and a fast fabric, because every participant waits on the others; throughput jobs simply fill cores and care little about latency between nodes. Both are admitted through a batch queue rather than by requesting machines one at a time, and <a href=\"/definitions/what-is-slurm\">SLURM</a> is the scheduler most often found in that role - submit, wait for allocation, run, release.",
          "That queueing pattern is why HPC procurement has historically been a capacity decision rather than an on-demand one: a site buys for its peak workload and the scheduler smooths demand across it. The operational side of running this on VirtEngine - schedulers, adapters and job-shaped orders - is set out in <a href=\"/learn/hpc-on-virtengine\">HPC on VirtEngine</a>.",
          "The distinction shapes how capacity is planned. Throughput work spreads across whatever machines happen to be free and tolerates a busy queue; tightly coupled work cannot, because a single slow participant stalls everyone waiting on it. Sites respond by reserving the fastest fabric for jobs that will genuinely use it and pushing everything else to the general pool. Renters of the same systems face an echo of the question: whether a job needs a whole machine or only a share of one.",
        ],
      },
      {
        heading: "Who runs HPC workloads",
        paragraphs: [
          "Universities and research facilities simulate weather, materials, fluids and molecular behaviour; industry teams model vehicles, structures and risk; media studios render; and <a href=\"/definitions/what-is-ai-training\">machine-learning training</a> has become a frequent guest on the same machines, since it also wants many accelerators and a scheduler.",
          "What these buyers share is a queue-shaped demand: occasional need for a lot of compute, deadlines that vary, and no desire to own a cluster that would sit between runs. That pattern is what makes per-job purchasing worth considering at all.",
          "The other shared trait is unevenness. Work arrives in bursts around deadlines with quiet stretches in between, and a cluster owned outright is paid for during those stretches as well. A large site absorbs that by keeping one queue full across many groups; a single team cannot, which is why shared facilities and rented capacity exist as answers to the same arithmetic.",
        ],
      },
      {
        heading: "Compute sold by the job",
        paragraphs: [
          "On VirtEngine, an HPC requirement is written down rather than assumed: node count, duration, interconnect and storage expectations, plus the scheduler the job is written for. The tenant funds an escrow account with that request, so providers with free nodes can see committed budget before answering it, and bids compete on price and on what the site can actually offer.",
          "Once matched, the lease is fulfilled through the provider's scheduler adapter, which places the job on real hardware and reports node-time as signed usage records. Settlement draws validated line items from escrow after the dispute window and returns whatever is unspent. Capacity and category detail sit with <a href=\"/marketplace/hpc\">HPC listings on the market</a>.",
        ],
      },
    ],
    faq: [
      {
        question: "What is HPC used for?",
        answer:
          "For computational work that needs many processors at once: simulation and modelling of weather, materials, fluids and molecules, engineering analysis, rendering, risk calculation, and machine-learning training. The common factor is a job that parallelises well across nodes.",
      },
      {
        question: "What does a typical HPC system consist of?",
        answer:
          "Compute nodes with many cores and large memory, a fast interconnect between them, parallel or scratch storage, a batch scheduler that allocates nodes, and the site infrastructure supporting all of it. The scheduler and the fabric are what separate a cluster from a room full of servers.",
      },
      {
        question: "How does HPC differ from ordinary cloud computing?",
        answer:
          "HPC jobs are parallel, often tightly coupled, and need whole nodes, low-latency networking and a queue. They are scheduled in blocks rather than provisioned per machine on demand, which changes both the architecture and the way compute is purchased.",
      },
      {
        question: "Can HPC compute be bought for a single job?",
        answer:
          "That is the marketplace model: a job-shaped requirement is posted with node count, duration and interconnect, escrow funds it, and a provider with free capacity fulfils it through its scheduler. Usage is metered for the duration of the run and settles after the dispute window.",
      },
    ],
    related: [
      "what-is-slurm",
      "what-is-ai-training",
      "gpu-as-a-service",
      "what-is-bare-metal",
      "what-is-a-compute-marketplace",
    ],
    funnel: { label: "HPC on VirtEngine guide", href: "/learn/hpc-on-virtengine" },
    practice:
      "A job is described by node count, duration and fabric needs, escrowed by the tenant, then placed on a provider's cluster through its scheduler with node-time signed and settled afterwards.",
  },
  {
    slug: "what-is-cloud-computing",
    term: "What is cloud computing?",
    summary:
      "What is cloud computing? IT resources delivered over a network and consumed as needed: what the model rests on, what it hides, how capacity is traded.",
    group: "Infrastructure",
    media: "network-earth",
    mediaCaption: "An operations room and wall displays.",
    sections: [
      {
        paragraphs: [
          "<strong>Cloud computing</strong> is the delivery of computing resources - servers, storage, databases, networking and software - over a network so that they are consumed as a service rather than owned as equipment.",
          "The idea is plain: capacity is requested through an API instead of a procurement cycle, paid for while it is used, and scaled up or down without rearranging hardware. Beneath the phrase sit virtualisation, automation, metering and a great deal of physical infrastructure. Cloud computing is an operating model rather than a location, and it can be operated by a hyperscaler, a regional provider, a research institution, or a team inside your own organisation.",
        ],
      },
      {
        heading: "What the model rests on",
        paragraphs: ["Four or five capabilities do most of the work:"],
        list: [
          "Virtualisation - hypervisors and containers dividing machines into independently usable parts.",
          "Self-service and APIs - capacity requested by software rather than by ticket.",
          "Pooling - many users drawing on shared resources, which is what makes elasticity possible.",
          "Metering - consumption measured, so it can be billed, forecast and attributed.",
          "Physical infrastructure - datacenters, power, cooling and networks, on which everything above depends.",
        ],
        after: [
          "The last item is the one the vocabulary hides. Every abstraction in the list terminates on machines in a building, and the quality of a cloud service still depends on that equipment and on the people who maintain it. Claims about a cloud should therefore be traceable to an operator with racks, not to a diagram.",
          "Independence deserves the same scrutiny. Moving away from a provider means re-implementing whatever depended on its particular APIs, its identity model or its managed services, and that cost is paid once per integration. Portability is far easier to arrange at the start of a project than to recover at the end of one, which is why the details of export and interface support belong in an evaluation rather than in a later migration plan.",
        ],
      },
      {
        heading: "The layers beneath the phrase",
        paragraphs: [
          "Resources from a cloud are usually described at one of three levels, each moving a different share of the work to the provider: <a href=\"/definitions/what-is-iaas\">infrastructure</a>, where you receive machines; platforms, where you receive a deployment target; and <a href=\"/definitions/what-is-cloud-storage\">services such as storage</a> consumed directly. Which layer a workload belongs on is decided by how much of the machinery the team wants to own.",
          "The same capacity can also be deployed in different patterns - public, private or hybrid - and run on open source software by the operator. Those patterns are covered in the hub's other definitions; this page is about the category itself, not about any one arrangement of it.",
          "The choice matters at the point of purchase because it fixes what you remain accountable for afterwards. A team renting machines inherits patching, configuration and capacity planning; a team on a platform inherits deployment policy and quota; a team using software inherits almost none of it and gives up control of the release cycle in exchange. None of those answers is a verdict on the others - each is a decision about how much of the stack someone is willing to run.",
        ],
      },
      {
        heading: "What buyers actually evaluate",
        paragraphs: [
          "Elasticity is the headline and rarely the deciding factor. Transfer policies and storage rates often move the total cost more than the hourly compute rate does; data gravity means the second workload is harder to move than the first was; and proprietary managed services deepen an integration with every team that adopts them.",
          "Responsibility also follows the layer you rent. Everything above the rented boundary stays with the tenant - configuration, access control, data handling - so a cloud does not remove operations, it changes what operations are about. Teams that plan for that distinction get more out of the model than teams expecting the machinery to disappear.",
        ],
      },
      {
        heading: "Capacity traded in the open",
        paragraphs: [
          "Cloud computing does not have to be bought from a single vendor with a single account. On VirtEngine, capacity from independent operators is published in one place where it can be compared on stated attributes: what hardware is offered, where it sits, what it costs, and what the provider is able to serve.",
          "Orders are backed by escrow, matches become leases binding tenant, provider and funds, and the resulting usage is reported as signed records that settle after a dispute window under governance-set parameters rather than a private platform margin. VEID may be requested for an individual offer, but it is not a prerequisite for every marketplace transaction. The full sequence is described in <a href=\"/learn/how-the-marketplace-works\">how the marketplace works</a>.",
        ],
      },
    ],
    faq: [
      {
        question: "What is cloud computing in simple terms?",
        answer:
          "Computing resources - servers, storage, networking, software - delivered over a network and consumed as needed instead of bought as equipment. You request capacity through an API and pay for what you use.",
      },
      {
        question: "What is the difference between cloud computing and hosting?",
        answer:
          "Hosting rents a fixed amount of space or a machine, while cloud computing exposes capacity through an API that scales, meters and provisions automatically. In practice the boundary has blurred, and the distinction now matters less than what control layer you are given.",
      },
      {
        question: "What are the main cloud service models?",
        answer:
          "Infrastructure, platform and software. Infrastructure hands you machines, platform hands you a deployment target, and software hands you an application; each moves a different part of the operational work to the provider.",
      },
      {
        question: "Is the cloud always cheaper?",
        answer:
          "No. It converts capital expense into operating expense and rewards workloads that scale, but transfer, storage and always-on steady state can cost more than owned capacity. The honest comparison is workload by workload, using real usage data rather than list prices.",
      },
    ],
    related: [
      "what-is-iaas",
      "what-is-cloud-storage",
      "what-is-a-compute-marketplace",
      "what-is-decentralized-cloud",
    ],
    funnel: { label: "What the marketplace sells", href: "/marketplace" },
    practice:
      "Capacity from several operators is compared in one catalogue: an order funds escrow, the matched lease runs against it, and signed usage is what finally moves money.",
  },
  {
    slug: "what-is-a-virtual-machine",
    term: "What is a virtual machine?",
    summary:
      "What is a virtual machine? A software emulation of a computer on shared hardware: how virtualisation works and how instances reach the market.",
    group: "Infrastructure",
    media: "hero-infrastructure",
    mediaCaption: "A server aisle in a data centre.",
    sections: [
      {
        paragraphs: [
          "A <strong>virtual machine</strong> is a software emulation of a computer - its own processors, memory, storage and network interfaces - running on physical hardware shared with other machines of the same kind.",
          "Each VM runs its own operating system and behaves from inside like a standalone machine; it is unaware that the hardware beneath it is shared. A layer called the hypervisor draws the boundary, allocating real resources to each guest and keeping the guests apart. Because that boundary sits at the hardware level, different operating systems can run side by side on one host, and an entire machine can be saved, cloned and moved as a file.",
        ],
      },
      {
        heading: "What a VM is made of",
        paragraphs: ["A virtual machine is a small assembly:"],
        list: [
          "A hypervisor - the layer that partitions the host and enforces isolation between guests.",
          "A guest operating system - booted inside the VM, with no view of its neighbours.",
          "Virtual devices - disk, network and clock interfaces presented to the guest, emulated or paravirtualised.",
          "An image - the template a machine is created from, holding the operating system and whatever else was baked into it.",
          "A lifecycle - create, start, pause, snapshot, resize, migrate, destroy, each addressable through an API.",
        ],
        after: [
          "Isolation is the property people buy. Two workloads sharing a physical host are separated by the hypervisor rather than by an operating system process, which is a stronger boundary and a heavier one - every guest carries its own kernel, and that cost is measured in memory and startup time rather than in risk.",
        ],
      },
      {
        heading: "Virtual machines beside containers",
        paragraphs: [
          "The nearest rival to a VM is the <a href=\"/definitions/what-is-containerization\">container</a>: a package sharing the host kernel, isolated by kernel features rather than by a separate operating system. Containers start faster and cost less memory; VMs give a hardware-level boundary and can run a different operating system on the same host.",
          "Most systems use both. Virtual machines provide the nodes - the isolated, replaceable machines a control plane manages - and containers run on those nodes as the unit of deployment. Choosing between them is usually a question about the boundary you need, not a verdict on either technology.",
        ],
      },
      {
        heading: "Where virtual machines come from",
        paragraphs: [
          "VMs are what <a href=\"/definitions/what-is-iaas\">infrastructure as a service</a> actually sells: an instance is a defined shape of machine created from an image on demand. The machinery behind that request is a cloud control plane, and <a href=\"/definitions/what-is-openstack\">OpenStack</a> is the best-known open source example - it exposes the create, resize and destroy calls, plus the images, networks and quotas around them.",
          "Beneath the control plane sits the hypervisor itself, commonly KVM on Linux hosts. The separation matters when evaluating a provider: the control plane determines what you can request, while the virtualisation layer determines how strongly the resulting machines are isolated from one another.",
          "Images carry most of the operational weight. An instance is only as reproducible as the image it started from, so teams that treat images as build artefacts - versioned, rebuilt from a definition, discarded when obsolete - can treat machines as disposable. Teams that patch them in place after creation tend to discover that the control plane's idea of a machine and the machine's real state have drifted apart.",
        ],
      },
      {
        heading: "Machines selected by attribute",
        paragraphs: [
          "On VirtEngine, an instance is chosen by describing it: processor count, memory, image, region, network rules. That description is matched against <a href=\"/marketplace/iaas\">published infrastructure listings</a> where a provider states which shapes it will serve and on what terms, so the comparison happens on specification rather than on a sales conversation.",
          "The tenant funds an escrow account when placing the order, the match becomes a lease binding the three parties together, and the provider's control plane builds the machine and meters its runtime. Usage arrives as signed records, drawn from escrow as line items after the dispute window, with anything unspent returned when the lease closes.",
          "Choosing by attribute also makes the trade-offs visible. A shape picked for a steady workload can be resized when demand changes, and a snapshot offers a route back that a rebuild does not. What none of that repairs is a workload which assumed it owned the hardware underneath: kernel modules, timing assumptions and device access are the usual surprises when a machine stops being a fixed thing.",
        ],
      },
    ],
    faq: [
      {
        question: "What is a virtual machine in simple terms?",
        answer:
          "A software computer running on real hardware alongside other software computers. It has its own operating system and resources, and it does not know that the machine beneath it is shared with anything else.",
      },
      {
        question: "What is the difference between a VM and a container?",
        answer:
          "A VM runs its own operating system on hardware partitioned by a hypervisor; a container shares the host kernel and is isolated by kernel features. VMs give a heavier, hardware-level boundary; containers are lighter and start faster.",
      },
      {
        question: "What is a VM image?",
        answer:
          "A template containing the operating system and whatever software was baked into it, used to create new machines quickly. Instances made from the same image start identical, which is what makes configuration reproducible at scale.",
      },
      {
        question: "How is a virtual machine bought on a marketplace?",
        answer:
          "By describing the shape you need - processors, memory, image, region - and matching it against published listings. The order funds escrow, the provider builds the instance, and metered runtime settles against that escrow after a dispute window.",
      },
    ],
    related: [
      "what-is-iaas",
      "what-is-containerization",
      "what-is-bare-metal",
      "what-is-an-open-source-cloud-platform",
    ],
    funnel: { label: "Virtual machines as listings", href: "/marketplace/iaas" },
    practice:
      "A tenant specifies processors, memory and image; listings matching that description are compared, one is ordered through escrow, and runtime is metered against it until the lease closes.",
  },
  {
    slug: "what-is-containerization",
    term: "What is containerization?",
    summary:
      "What is containerization? Packaging an application with its dependencies into an image that runs the same everywhere: built once, run anywhere.",
    group: "Infrastructure",
    media: "open-source-screen",
    mediaCaption: "Code on a laptop screen.",
    sections: [
      {
        paragraphs: [
          "<strong>Containerization</strong> is the practice of packaging an application together with everything it needs to run - libraries, runtime, configuration, dependencies - into a single isolated unit that behaves the same wherever it is started.",
          "Containers achieve this by sharing the host operating system kernel and being isolated from one another by kernel features instead of by separate virtual machines. The product of a build is an image: a read-only, versioned artefact that can be stored in a registry and started anywhere the runtime supports it. A running container is that image plus a writable layer, a network identity and a set of resource limits.",
        ],
      },
      {
        heading: "From source to running container",
        paragraphs: ["The path a change travels is short and repeatable:"],
        list: [
          "A build definition - the recipe that installs dependencies and produces the image.",
          "Layers - the image stacks from cached layers, so unchanged parts are not rebuilt.",
          "A registry - where images are stored, versioned and pulled from.",
          "A runtime - the container engine and the orchestrator scheduling containers across machines.",
          "Rollout controls - replicas, health checks and rollbacks that make replacement routine.",
        ],
        after: [
          "The pipeline exists because the expensive part of shipping software is not the packaging but the differences between environments. When an image carries its dependencies, a test machine and a production machine differ only in configuration and data, and a release becomes a switch of tags rather than a sequence of manual steps performed by whoever happened to be awake.",
          "Consistency from this pipeline is real but not total: the host kernel version, the CPU architecture, and every service outside the container still differ between environments. Containerization removes a large class of environment surprises; it does not remove configuration, and it does not make a badly packaged application portable. The image carries a security surface as well - everything baked into it stays there until the image is rebuilt, so scanning, pinning base images and rebuilding on a schedule are the maintenance work this model creates in place of some of the patching that owning machines demanded.",
        ],
      },
      {
        heading: "Containers next to virtual machines",
        paragraphs: [
          "A <a href=\"/definitions/what-is-a-virtual-machine\">virtual machine</a> virtualises hardware and boots a full operating system; a container isolates processes on a shared kernel. The difference shows up in density and startup time on one side, and in the strength of the isolation boundary on the other.",
          "The two are complements more often than alternatives. Machines provide the nodes, containers provide the unit of deployment, and an orchestrator treats those nodes as interchangeable capacity. Code that skips the platform altogether and runs per event is the neighbouring pattern described in <a href=\"/definitions/what-is-serverless\">serverless computing</a>.",
          "What the container does not change is state. Databases, files and anything else that must survive a restart live outside it, addressed by connection details rather than by the image. Teams that treat the container as the whole application tend to lose work on the first replacement; teams that treat it as packaging find the same replacement uneventful.",
        ],
      },
      {
        heading: "Where containerization shows up commercially",
        paragraphs: [
          "Most <a href=\"/definitions/what-is-paas\">platform services</a> are built on containers: the customer delivers an image or a build, and the platform decides where it runs. Managed container platforms - clusters, control planes, registries and add-ons operated for you - are the product being sold, with the underlying machines treated as an implementation detail.",
          "That makes containerization the load-bearing assumption behind a growing share of infrastructure purchasing. Teams evaluate these offerings on Kubernetes version, node shapes, networking, quotas and how much of the cluster they are still allowed to operate - all attributes a listing can state plainly.",
          "A second reason the pattern spread is procurement. Once a team can describe what it buys as an image plus a runtime, offerings from different providers become comparable on versions and quotas instead of on their installation instructions - the same shift that made instances comparable by shape rather than by datasheet.",
        ],
      },
      {
        heading: "Platforms listed as offerings",
        paragraphs: [
          "On VirtEngine, a container platform is published as an offering: what the managed cluster includes, which runtime versions it carries, what quotas apply, and the terms under which it is sold. A tenant orders that entry and funds an escrow account at the same time, so the provider can verify committed budget before provisioning capacity.",
          "The matched lease then reaches the provider's control plane, which creates the cluster and its quota against the order. Consumption comes back as signed usage records, disputable by either side, and is paid out of escrow only after the window for objections has closed. Categories can be browsed beforehand at <a href=\"/marketplace/paas\">platform listings on the market</a>.",
        ],
      },
    ],
    faq: [
      {
        question: "What is containerization in simple terms?",
        answer:
          "Packaging an application with its libraries and dependencies into a self-contained unit that runs the same on a laptop, a test server and production. The package is the image; running it produces a container.",
      },
      {
        question: "How does containerization differ from a virtual machine?",
        answer:
          "Containers share the host operating system kernel and are isolated by kernel features; virtual machines each boot their own system on hardware partitioned by a hypervisor. Containers are lighter and faster to start, while VMs offer a hardware-level boundary.",
      },
      {
        question: "Does containerization remove the need for operations?",
        answer:
          "No. It removes a class of environment mismatch and makes replacement routine, but images still have to be built, scanned, versioned and rolled out, and the cluster underneath is operated by someone - you, or the provider of a managed platform.",
      },
      {
        question: "How is containerization bought on a marketplace?",
        answer:
          "As a listing that declares its runtime versions, node shapes and quotas. Ordering funds an escrow account, the provider provisions the cluster through its control plane, and metered resource usage settles against that escrow after the dispute window.",
      },
    ],
    related: [
      "what-is-paas",
      "what-is-a-virtual-machine",
      "what-is-serverless",
      "what-is-openstack",
      "what-is-an-open-source-cloud-platform",
    ],
    funnel: { label: "Containers and platforms", href: "/marketplace/paas" },
    practice:
      "A managed cluster is listed with its runtime versions and quotas; a tenant orders it through escrow and the provider reports what the project consumed until the lease settles.",
  },
  {
    slug: "what-is-cloud-storage",
    term: "What is cloud storage?",
    summary:
      "What is cloud storage? Data held on remote systems and reached over a network: the shapes it comes in, durability, and how capacity is metered.",
    group: "Infrastructure",
    media: "provider-datacenter",
    mediaCaption: "Racks of storage in a data centre.",
    sections: [
      {
        paragraphs: [
          "<strong>Cloud storage</strong> is data held on remote infrastructure and accessed over a network, maintained by a provider rather than stored on the machine using it.",
          "Requests travel across the network to storage systems the tenant never sees, addressed through an API rather than a drive letter. The capacity arrives in shapes: block volumes that behave like disks, shared file trees, and object stores addressed over HTTP. What the shapes share is a division of labour - the provider builds and maintains the storage layer, while the tenant decides what to put in it, who may read it, and when it may be deleted.",
        ],
      },
      {
        heading: "The shapes and what each is for",
        paragraphs: ["Storage categories are distinguished by how they are addressed and shared:"],
        list: [
          "Block - volumes attached to a compute instance, read and written like a local disk.",
          "File - hierarchical and shared, so several machines can mount the same tree.",
          "Object - buckets addressed over HTTP, with versioning and lifecycle rules, suited to backups, media and unstructured data.",
          "Archival tiers - slower storage for data that is rarely read but must be retained.",
          "Transient space - scratch attached to a workload and expected to disappear with it.",
        ],
        after: [
          "Choosing between them is a question about access patterns rather than about quality: transactional state wants block, shared working sets want file, bulk objects want object storage, and a wrong choice shows up as either wasted money or a rewrite later. The decision is usually made once and early, because moving data between shapes is a migration rather than a setting - attached volumes behave like disks, a shared file tree suits groups that must read one directory at once, and object storage asks callers to speak HTTP while versioning whatever they write.",
          "Placement matters as much as the shape. Data held in one region costs more to reach from another, and an application that reads across regions discovers that fact in latency well before it appears on a bill - which is why region is treated as part of an application's design rather than as a dropdown during setup.",
        ],
      },
      {
        heading: "Durability, availability and copies",
        paragraphs: [
          "Providers replicate data across drives and failure domains and publish what their designs are intended to survive. Two separate questions hide behind the word safe: whether the system keeps the data when hardware fails, which is durability, and whether you can still reach it, which is availability.",
          "Neither question covers accidental deletion, a leaked credential or a corrupt write, because redundancy does not protect against the data being overwritten or removed deliberately. Versions, retention rules and a copy outside the account remain decisions the tenant makes - and they are worth making before the first workload lands.",
          "Cost follows a similar pattern. Storage that is inexpensive to keep is rarely the fastest to read, so a retention rule written for compliance can become a fetch problem for whatever has to pull from it later. Reading the tiering terms next to the durability statement is dull work, and it is where the unpleasant surprises usually live.",
        ],
      },
      {
        heading: "Where storage sits in the stack",
        paragraphs: [
          "Storage is bought alongside <a href=\"/definitions/what-is-iaas\">infrastructure</a>, and the two are usually evaluated together: the volume has to be attachable, in the right region, at a rate that fits the workload. Transfer is the third leg - moving data out costs money in most arrangements, which is why data gravity is a real constraint on architecture rather than a figure of speech.",
          "The same reasoning applies when the wider category is in view. <a href=\"/definitions/what-is-cloud-computing\">Cloud computing</a> as a whole is evaluated on how its parts compose, and storage is the part that is hardest to move once placed.",
        ],
      },
      {
        heading: "Capacity sold as a metered service",
        paragraphs: [
          "On VirtEngine, storage reaches the market as a listing with its terms on the surface: capacity class, region, access characteristics and retention policy, published by the provider rather than quoted privately. The tenant funds an escrow account when ordering that capacity, so the provider sees committed budget before reserving space for it.",
          "What is stored is then measured over time and reported as signed usage records; the tenant can dispute a reading before it becomes a payment. Validated line items draw down escrow after the dispute window, and balance left at the end of the lease returns to the tenant. The category index is <a href=\"/marketplace/storage\">storage listings on the market</a>.",
        ],
      },
    ],
    faq: [
      {
        question: "What is cloud storage in simple terms?",
        answer:
          "Data kept on systems operated by a provider and reached over a network instead of on a disk attached to your machine. You send a request through an API and the provider's infrastructure returns or writes the data.",
      },
      {
        question: "What are the main types of cloud storage?",
        answer:
          "Block storage attaches volumes to a single machine and behaves like a disk. File storage exposes a shared hierarchical tree. Object storage addresses data over HTTP through buckets, with versioning and lifecycle rules built in.",
      },
      {
        question: "Does cloud storage back up my data?",
        answer:
          "Replication protects against hardware failure, not against deletion or compromise by an account holder. Versions, retention rules and a copy held elsewhere are separate responsibilities that stay with whoever controls the data.",
      },
      {
        question: "How is cloud storage metered on a marketplace?",
        answer:
          "By capacity held over time, reported as signed usage records that the tenant can review before they settle. Payment is drawn from the escrow account funded at order time, and unspent balance returns when the lease closes.",
      },
    ],
    related: [
      "what-is-iaas",
      "what-is-cloud-computing",
      "what-is-a-compute-marketplace",
      "what-is-usage-based-billing",
    ],
    funnel: { label: "Storage listings on VirtEngine", href: "/marketplace/storage" },
    practice:
      "A provider publishes capacity class, region and retention terms; ordering reserves the space against escrow, and the bytes held are what settle at the end of the lease.",
  },
];
