/**
 * Tier A definitions - high-intent "what is X" queries just below the
 * GSC-observed set (SEO-PLAN.md "Tier A"). Each entry owns exactly one primary
 * query, cross-links to an existing deep page, and closes on the marketplace
 * angle: how the thing is described, ordered, metered and settled on an open
 * market. Same editorial rules as definitions-gsc.ts (DESIGN.md 10): evergreen,
 * no invented figures, engineering candor, UK spelling in prose.
 */
import type { DefinitionEntry } from "./definitions";

export const DEFINITIONS_TIER_A: DefinitionEntry[] = [
  {
    slug: "what-is-ai-inference",
    term: "What is AI inference?",
    summary:
      "AI inference explained: what the term means, which hardware and constraints matter, and how inference capacity is listed, metered and settled.",
    group: "AI & GPU compute",
    media: "provider-datacenter",
    mediaCaption: "Where inference runs.",
    sections: [
      {
        paragraphs: [
          "<strong>AI inference</strong> is running a trained machine-learning model so that it produces output from new input - a classification, a prediction, a generated token, a detected object. Training is what built the model; inference is what the model does every time it is asked a question, which in a deployed system is continuously.",
          "The two stages share hardware but differ in shape. Training is one long parallel job that a cluster absorbs for days and judges by throughput per run. Inference is a service judged by how quickly it answers, how many concurrent requests it absorbs, and how much capacity sits idle between them. Most practical decisions about inference hardware follow from that asymmetry.",
        ],
      },
      {
        heading: "Inference versus training",
        paragraphs: [
          "A team that has trained a model already knows part of the answer: the same accelerator classes serve both workloads. What changes is the profile. Training wants large batches, deep parallelism and a scheduler that keeps hardware busy for hours; it is judged once at the end and re-run when the data or the objective changes. Inference wants predictable response times under a load curve nobody chose, and it runs for as long as the model stays in service. The other half of the pair is described in <a href=\"/definitions/what-is-ai-training\">AI training</a>.",
          "That divergence shows up in capacity planning. Training demand arrives in peaks and is scheduled around them; inference demand is sized against a baseline plus the headroom an endpoint tolerates. Some operators run both on one cluster, queueing batch training behind interactive traffic. Others separate them, because the failure modes and the buying patterns are different enough to deserve separate budgets.",
        ],
      },
      {
        heading: "What an inference workload needs",
        paragraphs: [
          "Choosing machines for an endpoint comes down to constraints that no spec sheet states directly:",
        ],
        list: [
          "Model residency - enough accelerator memory to hold the weights, plus the cache and activation headroom the serving stack needs for the context you accept.",
          "Batching behaviour - whether throughput comes from queueing many requests together or from answering one request immediately.",
          "Latency budget - interactive endpoints are dominated by time to first result; offline scoring jobs are dominated by total throughput.",
          "Host and fabric paths - how quickly tensors move between accelerator, system memory and network.",
          "Concurrency - how many simultaneous sessions an endpoint holds before queues grow and answers slow down.",
        ],
        after: [
          "None of these appear in a single GPU model number. They are properties of the model, the serving runtime and the machine taken together, which is why a result measured on one configuration says little about another.",
        ],
      },
      {
        heading: "The cost shape of a serving endpoint",
        paragraphs: [
          "Because inference runs continuously, its cost is dominated by what idles between requests. A model that answers in bursts still pays for the memory holding the weights resident, so teams size for residency first and throughput second - and some workloads suit a smaller accelerator that stays warm rather than a larger one that is mostly empty. Capacity that can be released when the workload stops is the practical answer to that, and it is a leasing decision before it is a hardware one.",
          "Which is why most teams rent rather than buy: model demand moves, a rewrite halves the memory footprint, a new release changes the batching behaviour. Renting converts that volatility into a parameter. The spectrum runs from a virtual machine with an accelerator attached, through a managed platform that takes a container and a port, to a hosted endpoint where the provider runs the serving stack too. Each step further along gives up control of the runtime for less work on your side - guidance for sizing the whole workload is in <a href=\"/solutions/ai-ml-workloads\">AI and ML workloads</a>.",
        ],
      },
      {
        heading: "Inference capacity on the open market",
        paragraphs: [
          "On VirtEngine, inference capacity is not a phone call with an account manager. A provider describes what it can supply - accelerator model and count, memory, fabric, host resources, the region the machines sit in - and publishes that description as a listing. A buyer either takes a listed offering at its published price or posts an order saying what is needed and lets providers bid against it. The mechanics of that exchange are covered in <a href=\"/learn/how-the-marketplace-works\">how the marketplace works</a>, and the accelerator category itself is <a href=\"/definitions/gpu-as-a-service\">GPU as a Service</a>.",
          "Once matched, the agreement becomes a lease backed by funded escrow: the budget is provably committed before the first model loads, so the provider serves no stranger's promise, and the tenant prepays nothing that settlement rules have not authorised. Usage is metered while the endpoint runs, submitted in signed batches, held open for a dispute window, and only then drawn down from escrow. Both sides read the same record from meter to payment, which is what allows either of them to buy time on hardware they have never stood in front of.",
        ],
      },
    ],
    faq: [
      {
        question: "How does AI inference differ from model training?",
        answer:
          "Training builds the model and consumes one long, highly parallel run; inference executes the finished model on new input and repeats for as long as the service is live. They share accelerator hardware but are measured differently - throughput per run against response time under load.",
      },
      {
        question: "What hardware is suited to AI inference?",
        answer:
          "It depends on the model rather than the marketing category: accelerator memory must hold the weights plus serving headroom, and the host and fabric paths must move tensors fast enough for the latency budget. Small models can serve well on modest hardware; large models need memory first and everything else second.",
      },
      {
        question: "Why is inference billed differently from training?",
        answer:
          "Training is a finite job with a start and an end, so it is easy to treat as a batch of capacity. Inference is a long-lived service whose load varies by hour, which makes metering and the ability to release capacity the deciding factors in what it costs.",
      },
      {
        question: "How is AI inference bought on VirtEngine?",
        answer:
          "As a listing or an order. Providers publish accelerator capacity with its specifications, tenants either buy at the listed price or let providers bid on a posted order, and the resulting lease is funded by escrow and settled from metered, signed usage records.",
      },
    ],
    related: [
      "what-is-ai-training",
      "gpu-as-a-service",
      "what-is-a-compute-marketplace",
      "what-is-hpc",
    ],
    funnel: { label: "Inference capacity on the market", href: "/marketplace/gpu-compute" },
    practice:
      "A team serving a model orders a GPU listing whose memory and fabric match its runtime; the lease meters while the endpoint answers and closes when the endpoint is torn down.",
  },
  {
    slug: "gpu-as-a-service",
    term: "What is GPU as a Service?",
    summary:
      "GPU as a Service rents accelerator capacity instead of buying servers. What the model covers, what a listing must state, and how usage settles.",
    group: "AI & GPU compute",
    media: "marketplace-hardware",
    mediaCaption: "A cable seated in a switch port.",
    sections: [
      {
        paragraphs: [
          "<strong>GPU as a Service</strong> is the delivery model in which accelerator capacity on someone else's machines is rented on demand, metered while it runs, and released when the work stops - instead of buying GPU servers and carrying them through their working lives.",
          "The service exists because accelerators are the awkward part of owning a cloud: driver stacks, host sizing, fabric topology, replacement when a card fails, and a hardware generation that moves faster than the equipment around it. What the renter receives is a unit of usable GPU capacity - a virtual machine with accelerators attached, a whole node, or a slice of one. What the operator keeps is the hardware, the datacenter and the operations. The two sides meet at a meter.",
        ],
      },
      {
        heading: "What a GPU listing has to state",
        paragraphs: [
          "Listings in this category are read by people who already know what will break if the description is vague. A useful one covers:",
          "These fields are also what the meter is measured against later. A lease that promised a device class and delivered a different one has to be visible from the record itself, not discovered afterwards in a support thread - which is a reason to publish specifications as structured data rather than as prose.",
        ],
        list: [
          "Accelerator class and count - the GPU model, how many, and whether they are whole devices or virtual slices.",
          "Memory per accelerator - the ceiling on model size, batch depth and context an endpoint can hold.",
          "Host resources - CPU, system memory and local storage feeding the accelerators.",
          "Fabric between devices - what decides whether multi-GPU serving behaves as one machine.",
          "Runtime and access - the image or managed platform deployed onto, and the interface called.",
        ],
        after: [
          "Read together those five lines say whether a listing suits a serving endpoint, a batch job or neither, before anyone opens a support ticket. Publishing them as structured fields is the difference between a catalogue and a conversation.",
        ],
      },
      {
        heading: "Renting versus owning accelerators",
        paragraphs: [
          "Owning GPU servers commits capital against hardware that will be superseded before the machine is retired, and leaves the owner carrying the risk that demand never arrives to match the purchase. Renting reverses the trade: no capital, capacity that follows the workload, and freedom to move to a different accelerator class when the model changes. In exchange the unit price at steady utilisation is higher and the roadmap belongs to someone else.",
          "Most teams decide by the shape of demand. Steady, saturating and predictable leans toward owned hardware; variable, experimental or bursty leans toward rented. Hybrid arrangements are ordinary - a base of owned machines with rented capacity absorbing peaks - and they are only workable when both sides bill the same way.",
          "Mixing the two is where the model proves itself. An organisation keeps hardware for the load it can forecast and rents the rest, moving work between them when availability, a different accelerator class or a changed workload make the arithmetic move. For that comparison to mean anything, a rented unit has to be described in the same terms as an owned one: the same resources, the same duration, the same picture of what was consumed.",
        ],
      },
      {
        heading: "Service model or infrastructure model",
        paragraphs: [
          "GPU as a Service describes the renting, not the depth of the stack. At one end a tenant gets a machine and installs the serving runtime itself, which keeps full control and all of the operational work. At the other end a managed platform accepts a container or an endpoint definition and runs the runtime, autoscaling and health checks as part of the offer. The distinction maps onto the wider <a href=\"/definitions/what-is-iaas\">infrastructure as a service</a> versus platform split, and it changes what the meter counts: an accelerator-hour at one end, a request or a project at the other. Capacity at the raw end of that spectrum overlaps with <a href=\"/definitions/what-is-bare-metal\">bare metal</a>, where the whole machine is the unit.",
          "The boundary is worth settling before ordering, because it decides who carries the tuning. A tenant renting an accelerator-hour with an image owns the runtime, the batching and whatever happens at peak; a tenant calling a managed endpoint owns only the traffic and the response times it gets back. Neither position is automatically cheaper - they simply price different amounts of work - and the wrong choice shows up as engineering effort rather than as a larger invoice.",
        ],
      },
      {
        heading: "GPU capacity on an open market",
        paragraphs: [
          "Providers who already own accelerators - the audience for <a href=\"/solutions/gpu-compute-providers\">GPU compute providers</a> - face a demand problem rather than a hardware one: the machines earn nothing while they wait for someone who already knows their address. Publishing them as listings turns idle accelerators into offers that buyers can compare field by field, on the same footing as every other provider on the exchange.",
          "The commercial mechanics are shared with the rest of the market rather than special-cased for GPUs. A tenant funds escrow when the order is placed, the matched lease binds one buyer, one provider and that escrow account, usage is metered hourly and reported in signed batches, and settlement draws line items from escrow after a window in which either party can dispute a reading. Pricing sits in the lease terms, the fee policy sits in protocol parameters, and no invoice is issued by the side that also ran the meter.",
        ],
      },
    ],
    faq: [
      {
        question: "Is GPU as a Service the same as cloud GPU hosting?",
        answer:
          "The terms overlap. GPU as a Service emphasises the delivery model - capacity rented and metered rather than owned - while cloud GPU hosting usually means a virtual machine with accelerators attached. Managed endpoints and GPU slices are also sold under the same heading.",
      },
      {
        question: "What is the difference between GPU as a Service and a dedicated GPU server?",
        answer:
          "A dedicated GPU server is a whole machine reserved for one tenant, which gives predictable topology and no neighbours. GPU as a Service covers that and lighter arrangements such as virtual slices or managed endpoints, where devices or the runtime are shared and provisioning is faster.",
      },
      {
        question: "Which workloads fit GPU as a Service?",
        answer:
          "Model inference, training runs, rendering, simulation and any other accelerator-bound job whose duration does not justify buying hardware. The deciding factor is whether demand is variable enough that renting beats owning over the life of the equipment.",
      },
      {
        question: "How is GPU as a Service billed on VirtEngine?",
        answer:
          "By metered usage against lease terms. Escrow is funded when the order matches, the provider's collector reports consumption in signed batches, readings wait out a dispute window, and settlement draws the validated line items from escrow.",
      },
    ],
    related: [
      "what-is-ai-inference",
      "what-is-bare-metal",
      "what-is-a-compute-marketplace",
      "what-is-iaas",
    ],
    funnel: { label: "GPU listings on VirtEngine", href: "/marketplace/gpu-compute" },
    practice:
      "A lab with spare accelerator nodes publishes them once with memory, fabric and host details visible; tenants order against that description instead of a sales conversation.",
  },
  {
    slug: "what-is-a-compute-marketplace",
    term: "What is a compute marketplace?",
    summary:
      "A compute marketplace matches demand for capacity with providers who have it. How orders, escrow and signed usage become settled payment.",
    group: "Marketplace & protocol",
    media: "settlement-ledger",
    mediaCaption: "A hand writing in a ledger.",
    sections: [
      {
        paragraphs: [
          "A <strong>compute marketplace</strong> is a venue where people who need computing capacity and people who have it meet, agree terms and transact - with discovery, ordering, payment and dispute handling performed by the venue rather than by a bilateral sales process.",
          "The category spans brokered resellers, managed clouds with a partner catalogue, and protocol-run exchanges. What separates them is who runs the rules. In a broker, one intermediary sets the price, holds the money and hears appeals. In a protocol marketplace, listing, matching, escrow and settlement are executed by software whose rules can be read, and the intermediary is a set of modules rather than a company.",
        ],
      },
      {
        heading: "What a compute marketplace replaces",
        paragraphs: [
          "Procurement of infrastructure by telephone works, and every large buyer has done it: describe the requirement, collect quotes, negotiate a contract, sign, wait, reconcile the invoice against a spreadsheet. A marketplace compresses that into structured fields and a published price, because the requirement and the offer are expressed in the same schema on both sides.",
          "It also replaces the discovery problem. Capacity that nobody can find is capacity that does not exist from a buyer's point of view, and the long tail of capable operators - a research facility, a colocation provider, a GPU farm - has never had a fair way to reach demand it does not already know. A public catalogue inverts that: reach follows the listing rather than the vendor's sales history.",
        ],
      },
      {
        heading: "How an order becomes a lease",
        paragraphs: [
          "Every marketplace in this shape runs the same five stages, in order:",
        ],
        list: [
          "Order - a deployment states what is needed and funds escrow, so the demand carries provable budget.",
          "Match - a named offering is taken at its listed price, or an open order collects bids and resolves to the best-ranked one.",
          "Lease - the match becomes a contract binding one tenant, one provider and one escrow account.",
          "Usage - consumption is metered, screened for anomalies and submitted in signed batches.",
          "Settlement - validated records price into line items, wait out a dispute window, then draw down escrow.",
        ],
        after: [
          "The full walkthrough, including what happens when the numbers are contested, is in <a href=\"/learn/how-the-marketplace-works\">how the marketplace works</a>. The point of the sequence is that each step produces a record instead of an assertion.",
        ],
      },
      {
        heading: "Three acquisition paths",
        paragraphs: [
          "A marketplace supports three buying motions rather than one, and which applies depends on how precisely the buyer knows what they want. A named offering can be taken at its published price when the listing already answers the requirement. An open order can be posted when the requirement is clear and the supplier is not, letting providers compete against it. Or a set of constraints can be submitted and matched against the eligible listings already on the market.",
          "The three price discovery differently. A published rate is a fact to compare before committing; a bid is a negotiation that happens once, in public, under stated rules; a match is a filter doing the work a salesperson would otherwise do. All three end in the same object - a lease, an escrow account and a meter - so a buyer can change path without changing how the resulting consumption is billed.",
        ],
      },
      {
        heading: "Why identity and escrow belong in the definition",
        paragraphs: [
          "Matching strangers is the easy part; the hard part is money and accountability. Escrow can reduce payment risk, while signed orders and leases record who entered an agreement. VEID is an optional, offer-specific trust signal; it does not replace clear terms, transaction evidence, or dispute handling. <a href=\"/definitions/what-is-decentralized-cloud\">Decentralised cloud</a> designs must make those protections understandable before a user commits.",
        ],
      },
      {
        heading: "What makes a compute marketplace open",
        paragraphs: [
          "On VirtEngine the venue is itself protocol software. Listings are published through one schema no matter which operator posts them, matching rules live in the marketplace module rather than in a private order desk, and the provider daemon reports the usage that settlement consumes. Nothing about how a price was reached or how a reading was accepted has to be taken on trust: the same state is visible to both parties.",
          "The commercial consequence is that terms stop being negotiable secrets. A rate is an attribute of a listing, a dispute window applies equally to both sides, and the settlement fee is a governed parameter rather than a platform's private take. For the mechanics behind those three sentences see <a href=\"/learn/escrow-and-settlement-explained\">escrow and settlement</a>.",
        ],
      },
    ],
    faq: [
      {
        question: "What is a compute marketplace used for?",
        answer:
          "Buying and selling infrastructure capacity: virtual machines, containers, platforms, storage, GPU and batch compute. It replaces per-vendor negotiation with one catalogue where requirements and offers are described in the same structure.",
      },
      {
        question: "How does a compute marketplace differ from a cloud provider?",
        answer:
          "A cloud provider owns or controls the capacity it sells and sets its own terms. A compute marketplace does not hold the machines - it matches buyers with independent providers and supplies the ordering, escrow and settlement rules both sides transact under.",
      },
      {
        question: "Who holds the money in a compute marketplace?",
        answer:
          "Escrow, funded by the tenant when the order is placed. The provider can verify the balance exists before serving, the funds move only under settlement rules, and anything unspent returns to the tenant when the deployment closes.",
      },
      {
        question: "How does VirtEngine implement the compute marketplace concept?",
        answer:
          "As an open-source protocol: on-chain orders and leases, optional scoped identity proofs, a provider daemon that matches, deploys and meters, and a settlement pipeline that converts signed usage records into payouts from escrow.",
      },
    ],
    related: [
      "what-is-decentralized-cloud",
      "what-is-usage-based-billing",
      "what-is-iaas",
      "what-is-cloud-computing",
    ],
    funnel: { label: "Browse the marketplace", href: "/marketplace" },
    practice:
      "Two offers from unrelated operators sit side by side with identical fields, so buyers compare machines and rates rather than sales decks.",
  },
  {
    slug: "what-is-decentralized-cloud",
    term: "What is a decentralized cloud?",
    summary:
      "A decentralized cloud runs workloads across independent providers under one protocol. What the category means, what it costs, how settlement works.",
    group: "Marketplace & protocol",
    media: "network-earth",
    mediaCaption: "Wall displays in an operations room.",
    sections: [
      {
        paragraphs: [
          "A <strong>decentralized cloud</strong> is computing capacity supplied by many independently operated providers and presented to users as one market, rather than by a single company's datacenter estate behind one API and one invoice.",
          "The aim is to keep what makes a cloud usable - self-service, an API, metering, capacity added on short notice - while removing the single operator from the trust model. No one company owns all the machines, sets every price, or can suspend an account on its own judgement. What holds the arrangement together instead is a shared protocol for describing capacity, placing workloads, verifying counterparties and settling payment.",
        ],
      },
      {
        heading: "What makes a cloud decentralised",
        paragraphs: [
          "Five conditions separate the category from a directory of vendors with a payment form attached:",
        ],
        list: [
          "Independent operators - each provider owns or controls its hardware and decides what to offer and at what rate.",
          "One description of capacity - listings expressed in a shared schema, so machines from different operators can be compared.",
          "Verifiable counterparties - identity checks on both sides before an order matches, rather than after a complaint.",
          "Escrowed payment - funds committed when the order is placed and released only under protocol rules.",
          "Signed usage - the meter's output attributable to the provider who produced it and open to challenge.",
        ],
        after: [
          "Drop any one of them and the system degrades into a broker with better marketing: someone ends up trusting a single party with the price, the meter and the money at the same time.",
        ],
      },
      {
        heading: "What it solves, and what it costs",
        paragraphs: [
          "The gains are structural. Pricing is set by competition among operators rather than by one party's list. Capacity comes from many sources, so an outage, a quota or an account suspension at one provider is an incident rather than a stoppage. Workload placement becomes a choice that can be revisited, and the terms of a lease are legible before any money moves.",
          "The costs are equally structural, and worth stating plainly. Hardware is heterogeneous, so portability between providers is work rather than a button. Capacity in different facilities carries different network paths. Support spans whoever ran the machine that hour. Performance cannot be assumed from a brand name when the brand is not supplying it. Decentralisation earns its place where those costs are smaller than the cost of depending on one operator - not everywhere.",
        ],
      },
      {
        heading: "Moving workloads between providers",
        paragraphs: [
          "Portability is the practical test of the category. A workload that can only run on one operator's proprietary services is rented rather than decentralised, because it cannot shift when price or availability changes. Workloads written against standard building blocks - <a href=\"/definitions/what-is-containerization\">containers</a>, virtual machine images, ordinary object storage - keep that option open, and a deployment spec stating resources, region and accelerator class can be evaluated against any listing that satisfies it.",
          "The limit is honest: portability is a property of how the workload was written, not something a marketplace can add afterwards. Providers differ in network path, hardware generation and locality, so a move may change performance as well as price. What protocol-level ordering removes from that decision is the renegotiation - the terms were published before the order, and the settlement works the same way on the next provider as on the last.",
        ],
      },
      {
        heading: "The protocol underneath",
        paragraphs: [
          "A decentralised cloud needs software that performs the roles a central platform would otherwise own. On VirtEngine that is a chain carrying marketplace, identity, economics and quality modules, a provider daemon that watches orders, bids, instantiates workloads and meters what they consume, and an open control plane through which providers publish their offerings. The architecture, module by module, is set out on the <a href=\"/protocol\">protocol page</a>, and the operators who supply capacity are described under <a href=\"/providers\">providers</a>.",
          "None of that is invisible plumbing. Because the rules live in code rather than in a platform's terms of service, both sides of a transaction can check what will happen to their funds and their data before agreeing to anything.",
        ],
      },
      {
        heading: "Capacity from strangers, sold as an order",
        paragraphs: [
          "The commercial question a decentralised cloud must answer is how a buyer pays an operator they have never dealt with. Here the answer is procedural rather than reputational: both parties verify identity before matching, the tenant funds escrow when the order is placed, and the provider starts work against a balance it can see rather than an invoice it hopes will arrive.",
          "From there the run follows the meter. Consumption is recorded in signed batches during the lease, each reading sits in a dispute window either side may use, and settlement converts the surviving readings into line items drawn from escrow - with whatever remains returning to the tenant. The provider does not have to be trusted with the price or the adjudication, because neither of those is its to decide.",
        ],
      },
    ],
    faq: [
      {
        question: "What is a decentralized cloud used for?",
        answer:
          "The same workloads as any other cloud - virtual machines, containers, platforms, storage, GPU and batch compute - supplied by independent operators instead of one vendor. Buyers use it when they want competitive terms and no single point of dependency.",
      },
      {
        question: "How is a decentralized cloud different from multi-cloud?",
        answer:
          "Multi-cloud means a customer contracts with several providers, each with its own API, contract and invoice. A decentralized cloud supplies one market and one settlement path across many independent operators, so the variety is inside the platform rather than in the customer's procurement folder.",
      },
      {
        question: "What are the disadvantages of a decentralized cloud?",
        answer:
          "Heterogeneous hardware, variable network paths between facilities, support that may span more than one operator, and performance that has to be established per listing rather than assumed from a brand. Those are the trade the category asks buyers to make.",
      },
      {
        question: "How does VirtEngine fit the decentralized cloud category?",
        answer:
          "It supplies the protocol layer: on-chain orders and leases, provider-disclosed identity requirements where supported, escrow, a provider daemon that meters and signs usage, and settlement that pays out under governed rules. The machines and the operations remain with independent providers.",
      },
    ],
    related: [
      "what-is-a-compute-marketplace",
      "what-is-cloud-computing",
      "what-is-an-open-source-hybrid-cloud",
      "gpu-as-a-service",
    ],
    funnel: { label: "How the protocol works", href: "/protocol" },
    practice:
      "An operator publishes machines from several facilities through one catalogue; tenants see a single set of terms and never need to know which rack the work lands on.",
  },
  {
    slug: "what-is-slurm",
    term: "What is SLURM?",
    summary:
      "SLURM is the cluster scheduler behind most HPC sites. What it controls, why it became the standard, and how its jobs reach the market.",
    group: "HPC",
    media: "hero-infrastructure",
    mediaCaption: "Racks down a data-centre aisle.",
    sections: [
      {
        paragraphs: [
          "<strong>SLURM</strong> is an open source job scheduler for Linux clusters: it divides a fleet of machines into partitions, decides which job runs on which node and when, and enforces the allocation rules the site has set. The name is short for Simple Linux Utility for Resource Management.",
          "SLURM sits between a user with an allocation and the hardware. Jobs arrive with requirements - a partition, a node count, an accelerator count, a walltime limit - and the scheduler places them, queues them behind policy, or rejects them. On a well-run site nothing executes on a node outside its accounting, which is why the scheduler doubles as the record of what happened.",
        ],
      },
      {
        heading: "What SLURM controls",
        paragraphs: ["The scheduler's responsibility covers the whole job lifecycle:"],
        list: [
          "Partitions and nodes - which queues exist, what hardware sits in them, and who may submit to each.",
          "Job state - pending, running, completed, failed and cancelled, including dependencies between jobs.",
          "Policy - fairshare, quality-of-service levels, reservations and priority weights.",
          "Isolation - CPU, memory and accelerator allocation per job, typically enforced with cgroups.",
          "Accounting - who ran what, for how long, against which allocation.",
        ],
        after: [
          "That last item is why research facilities and national laboratories standardise on it: the component enforcing the rules and the component producing the billback report are the same component.",
        ],
      },
      {
        heading: "Why it became the default",
        paragraphs: [
          "SLURM won by being open, portable across hardware generations, and specific enough for batch work: users submit with familiar commands, a controller daemon assigns work, and daemons on the nodes execute it. Alternatives exist - PBS variants, LSF, MOAB - and remain in place at sites that have invested in them, often behind portals such as Open OnDemand that present the queue through a browser.",
          "Accelerators entered the model as allocatable resources rather than as a separate world, so a job can request GPUs alongside cores and memory and land on nodes that have them. Sites configure authentication to suit their own identity infrastructure, with munge the customary choice on clusters and token-based authentication used where a service talks to the controller.",
        ],
      },
      {
        heading: "A job's life through the queue",
        paragraphs: [
          "Users work with SLURM through submission commands: a batch script is handed over with the resources it needs, an interactive allocation is taken when a shell is wanted, and a step command launches work on the nodes already assigned. From there a job is pending until policy and capacity permit it, running while its steps execute, and finally completed or failed with output and exit status recorded where the submission asked for them.",
          "Two features make a queue usable at site scale. Arrays let one script stand for a family of related jobs, so a parameter sweep is scheduled as a group instead of as hundreds of separate submissions. Dependencies let one job wait on another, turning a pipeline of stages into a chain the scheduler holds together. Neither changes what an outside buyer sees: a job either receives its resources and runs, or it waits its turn.",
        ],
      },
      {
        heading: "SLURM jobs versus cloud leases",
        paragraphs: [
          "Supercomputing does not buy like cloud. Work arrives as jobs with resource requirements, walltime limits and partition targets, scheduled against allocation policies that encode years of institutional decisions. A long-running service lease, priced by the hour with an open-ended duration, is the wrong shape for that - and forcing batch work into it loses the accounting, the queueing fairness and the backfill that make a cluster efficient. For the wider category see <a href=\"/definitions/what-is-hpc\">HPC</a>.",
          "The mismatch runs both ways. A cluster operator asked to sell capacity does not want a tenant's container orchestrating over the top of the queue and bypassing policy, and a tenant does not want to hand a workload to a scheduler whose queue they cannot see. Both concerns point at the same design: expose the job, not the node.",
        ],
      },
      {
        heading: "Batch capacity as an order on the market",
        paragraphs: [
          "The <a href=\"/learn/hpc-on-virtengine\">HPC on VirtEngine guide</a> describes the bridge: the x/hpc module models a batch job on-chain with resource, walltime and partition requirements, and the provider daemon polls those jobs and dispatches them through a native SLURM adapter configured with the site's own authentication and partition names. Concurrency limits and timeouts are set by the operator, and job state is recovered crash-safely if a component restarts mid-run.",
          "What does not change is who owns scheduling. The cluster's controller still decides what runs where, so the marketplace becomes another source of authorized work rather than a second scheduler fighting it for the nodes. Usage from those jobs flows into the same signed reporting and settlement path as any other lease, and facilities able to sell spare cycles find them listed under <a href=\"/solutions/hpc-clusters\">HPC clusters</a> rather than quoted per customer.",
        ],
      },
    ],
    faq: [
      {
        question: "What does SLURM stand for and what does it do?",
        answer:
          "Simple Linux Utility for Resource Management. It is an open source scheduler that assigns batch jobs to the nodes of a Linux cluster according to partitions, policy and the resources each job requests.",
      },
      {
        question: "Is SLURM the same as a batch queue?",
        answer:
          "A queue is one part of it. SLURM also manages the nodes themselves, enforces isolation and priority, tracks dependencies between jobs, and produces the accounting records a site bills allocations against.",
      },
      {
        question: "Do SLURM sites have to change anything to sell capacity?",
        answer:
          "No re-platforming is required. The provider daemon's adapter speaks to the existing controller with the site's own authentication and partition configuration, so the scheduler keeps running the cluster exactly as it does for internal users.",
      },
      {
        question: "How are SLURM jobs paid for on VirtEngine?",
        answer:
          "An on-chain job is matched to a lease backed by escrow, the cluster executes it through the adapter, and usage from the job is reported in signed batches. Those records pass through the dispute window and settle from escrow like any other workload.",
      },
    ],
    related: ["what-is-hpc", "what-is-ai-training", "what-is-bare-metal", "what-is-containerization"],
    funnel: { label: "HPC jobs on the market", href: "/marketplace/hpc" },
    practice:
      "A site running SLURM for its own researchers exposes the same partitions to on-chain jobs through the adapter, with the controller still deciding what runs when.",
  },
  {
    slug: "what-is-usage-based-billing",
    term: "What is usage-based billing?",
    summary:
      "Usage-based billing charges for consumption rather than a subscription. What makes up the bill, who runs the meter, and how settlement works.",
    group: "Marketplace & protocol",
    media: "closing-hands",
    mediaCaption: "A handshake across a table.",
    sections: [
      {
        paragraphs: [
          "<strong>Usage-based billing</strong> charges a customer for what a service actually consumed - compute hours, accelerator hours, stored gigabytes, requests served - rather than a flat subscription or a contract price agreed in advance.",
          "It is the billing model cloud computing made ordinary, because cost tracks activity: a quiet period costs less than a busy one, and nobody has to renegotiate when demand changes shape. The model also raises a harder question than flat pricing does. Who observes the consumption, who assigns it a price, and what happens when the customer reads the number differently from the seller.",
        ],
      },
      {
        heading: "What a usage-based bill is made of",
        paragraphs: ["Five components, present in every implementation even when they are not visible:"],
        list: [
          "A meter - whatever observes consumption per workload, per hour or per request.",
          "A unit and a rate - the quantity counted, and the price attached to it.",
          "An aggregation period - how readings are grouped before they become line items.",
          "A route for disagreement - the window in which either side can challenge a reading.",
          "A settlement path - how validated readings turn into money moving.",
        ],
        after: [
          "Conventional platforms supply all five privately: the seller measures, the seller prices, the seller issues the invoice and the seller hears the appeal. Nothing is wrong with usage-based billing itself; the concentration is the problem.",
        ],
      },
      {
        heading: "Where the model came from",
        paragraphs: [
          "Metered charging predates computing - utilities have always billed for what passes through a meter - and the cloud industry adopted it because capacity is elastic and fixed tiers waste either the customer's money or the provider's machines. Since then the pattern has been extended and softened: reserved commitments that lower a rate, tiers that reward volume, and free allowances that absorb the long tail.",
          "What all of the variants share is dependence on an accurate reading. A model that prices the wrong quantity is not merely unfair, it is unverifiable, which is why the meter and not the rate card is the interesting engineering problem.",
        ],
      },
      {
        heading: "The problem with a seller-run meter",
        paragraphs: [
          "In a conventional cloud bill the seller runs the meter, prices the usage, issues the invoice and adjudicates disputes - a stack of roles that would be examined closely in any other commercial relationship. Contracts and reputational incentives limit the damage, and for most customers that has been enough.",
          "It stops being enough when the counterparty is anonymous, the contract is short-lived, or the volume is large enough that a discrepancy matters. Those are precisely the conditions a marketplace creates, which is why the meter has to move somewhere both sides can inspect it. The economics around a provider's margin are treated in <a href=\"/learn/provider-economics\">provider economics</a>.",
          "There is a quieter cost as well. When the operator also sets the units and the aggregation period, two offers are difficult to compare directly: the same workload can be expressed in different quantities and grouped differently, and the true figure only becomes visible after usage has been consumed. Structured listings reduce that comparison to reading the same fields on both sides before ordering.",
        ],
      },
      {
        heading: "Reserved commitments and allowances",
        paragraphs: [
          "Production pricing rarely sits at one extreme. Providers soften pure metering with a reservation - a commitment to a volume of capacity that buys a lower rate - and with allowances that absorb small irregular consumption before it becomes a line item. The structure keeps the advantage of metering, that cost follows demand, while removing the swings that make a budget difficult to defend.",
          "On a marketplace the same blend lives inside the lease rather than inside a contract negotiation. The listing carries the rate, the order states the duration and any reserved capacity, and the meter does the rest as the workload grows. Nothing has to be re-papered when consumption changes shape; only the reading changes. A buyer comparing that arrangement with another offer is reading <a href=\"/definitions/what-is-a-compute-marketplace\">the compute marketplace</a> listing itself, not reconstructing a quote from a sales thread.",
        ],
      },
      {
        heading: "Metering both sides can read",
        paragraphs: [
          "On VirtEngine the sequence starts before any usage exists: the tenant funds an escrow account when the deployment is created, so the balance is provably committed and provably not yet transferred. The provider's collector then runs on a schedule - gathering per-workload metrics, turning them into records, screening them for anomalies, and submitting signed batches whose origin cannot be denied.",
          "Nothing settles immediately. Each reading waits out a window during which either party can dispute or correct it, after which the settlement module prices surviving records by the lease terms and draws them down from escrow at the full agreed amount; unspent balance returns to the tenant. The full sequence, including the pipeline defaults, is written up in <a href=\"/learn/escrow-and-settlement-explained\">escrow and settlement explained</a>. The result is a bill neither party had to trust the other to produce.",
        ],
      },
    ],
    faq: [
      {
        question: "What is usage-based billing in cloud computing?",
        answer:
          "Charging for measured consumption instead of a fixed plan: compute and accelerator hours consumed, storage held, requests served. The customer pays for what the workload actually drew during the period.",
      },
      {
        question: "What is the difference between usage-based billing and a subscription?",
        answer:
          "A subscription charges the same amount regardless of consumption and usually caps or ignores what is used. Usage-based billing varies with activity, which suits elastic demand but requires an accurate, agreed meter to work.",
      },
      {
        question: "Who verifies the meter on VirtEngine?",
        answer:
          "The provider measures and signs each batch, the protocol screens and reconciles the records, and both parties may dispute a reading inside a fixed window before settlement. No single party both produces the number and rules on it.",
      },
      {
        question: "What happens if the tenant's escrow runs out?",
        answer:
          "Leases close for non-payment and service stops, so a provider is never left serving unbacked hours. Any balance left when a deployment closes returns to the tenant rather than being forfeited.",
      },
    ],
    related: [
      "what-is-a-compute-marketplace",
      "what-is-serverless",
      "what-is-iaas",
      "what-is-decentralized-cloud",
    ],
    funnel: { label: "How settlement works", href: "/learn/escrow-and-settlement-explained" },
    practice:
      "An hour of consumption is reported as a signed record, visible to both parties, and paid from escrow only after the window to challenge it has closed.",
  },
  {
    slug: "what-is-bare-metal",
    term: "What is bare metal?",
    summary:
      "Bare metal is a whole physical server for one tenant. When to choose it over virtual machines, what you take on, and how it is listed.",
    group: "Infrastructure",
    media: "provider-technician",
    mediaCaption: "A technician working on hardware.",
    sections: [
      {
        paragraphs: [
          "<strong>Bare metal</strong> is a physical server dedicated to a single tenant, with the operating system and its workloads running directly on the hardware instead of on a hypervisor shared with other customers.",
          "Nothing sits between the machine and what you install: the kernel, the filesystem layout, the virtualisation stack if you want one, and the devices on the bus are all your choice. What you trade away is the instant, elastic provisioning a virtualised cloud is built around. Bare metal is handed over rather than conjured, and it is scaled by acquiring another machine rather than by resizing a resource.",
        ],
      },
      {
        heading: "Bare metal versus virtual machines",
        paragraphs: [
          "A <a href=\"/definitions/what-is-a-virtual-machine\">virtual machine</a> is software that emulates a computer on hardware shared with other tenants, which is what makes provisioning fast and resizing possible. The cost of that sharing is a layer of scheduling between your software and the machine: noisy neighbours, a host you cannot inspect, and limits on what kernel-level features are available to you.",
          "Bare metal removes the layer and the benefit together. You get the whole machine's cores, memory and devices with no emulation overhead and no neighbour effects, and in exchange you wait longer for the machine, you lose the ability to migrate around a host failure, and you accept that scaling happens in machine-sized steps. Neither answer is categorically correct - the question is whether the abstraction is worth what it costs you.",
        ],
      },
      {
        heading: "When bare metal is the right answer",
        paragraphs: ["Certain workloads keep bringing buyers back to the physical machine:"],
        list: [
          "Latency- and throughput-sensitive databases that cannot absorb a virtualisation layer.",
          "Software licensed per core or per socket, where every allocated vCPU becomes a cost.",
          "Regulated workloads whose audit scope has to name the hardware they ran on.",
          "Accelerator topologies where bus lanes, NUMA boundaries and fabric placement decide performance.",
          "Steady, saturating load that would never use the elasticity a VM pool is there to provide.",
        ],
        after: [
          "The common thread is a reason to care about the physical machine itself. When no such reason exists, a virtual machine is usually the better buy - and the <a href=\"/learn/iaas-paas-saas-on-virtengine\">service-model comparison</a> covers where each fits.",
        ],
      },
      {
        heading: "What you take on",
        paragraphs: [
          "Dedicated hardware changes the operational contract. Provisioning takes longer than an API call, because a machine has to be found, imaged and checked. A hardware fault is a replacement rather than a migration. Capacity planning becomes yours: idle cores cannot be returned to a shared pool, and growth means another machine in the rack rather than a larger value in a form.",
          "Plenty of teams want exactly that trade - they have an operations function, a compliance reason, or a steady workload. For everyone else the honest answer is that virtual machines and managed platforms cover more ground with less responsibility, and most operators are willing to sell both because the two buyers are usually different departments rather than different companies.",
        ],
      },
      {
        heading: "What sits above the machine",
        paragraphs: [
          "Dedicated servers are also the layer the other models are built from. A virtual machine runs on a hypervisor installed on a physical host; a container host runs containers on an operating system that is itself sitting on metal. A provider selling bare metal is therefore selling the bottom of its own stack, and whoever rents it decides what gets installed there - a hypervisor farm, an orchestration cluster, a database that wants the machine to itself, or nothing but an operating system and a monitoring agent.",
          "The categories overlap in practice rather than compete. Teams that want orchestration but not the neighbours take a set of machines and build on them; teams that want neither take a virtual machine and stop thinking about hardware. It comes down to how much of the stack you intend to operate, which is the same question that decides whether dedicated hardware belongs in the project at all.",
        ],
      },
      {
        heading: "Bare metal as a listing",
        paragraphs: [
          "On the marketplace a dedicated machine is simply a fixed-capacity offer: a provider states the machine class - processors, memory, storage, network, any accelerators - along with where it sits and on what terms it is available. A buyer either accepts that description at the published price or posts an order describing the shape of machine required and lets providers answer it, as set out in <a href=\"/learn/anatomy-of-a-marketplace-listing\">the anatomy of a listing</a>.",
          "Both parties verify identity before the order matches, and the tenant funds escrow so the provider starts from committed funds rather than an open invoice. While the lease runs, consumption is metered and reported in signed batches; readings wait out a dispute window; settlement prices them against the lease and draws them from escrow. The category on VirtEngine is <a href=\"/marketplace/iaas\">the IaaS marketplace</a>, where bare metal sits alongside the virtual machines it is usually compared against.",
        ],
      },
    ],
    faq: [
      {
        question: "What is the difference between bare metal and a virtual machine?",
        answer:
          "Bare metal gives one tenant the whole physical machine with no hypervisor in between; a virtual machine runs on hardware shared with other tenants through a virtualisation layer. Bare metal offers full control and no neighbour effects, while virtual machines provision and resize quickly.",
      },
      {
        question: "When should you choose bare metal?",
        answer:
          "When the physical machine matters: latency-sensitive databases, per-core licensing, audit scopes that must name hardware, accelerator topologies, or steady load that never needs elastic resizing. If none of those apply, virtual machines are usually simpler.",
      },
      {
        question: "Is bare metal slower to set up than cloud servers?",
        answer:
          "Yes. A virtual machine is created from a template, while a dedicated machine has to be allocated, imaged and verified first. The trade-off is the wait for full control of the hardware in exchange.",
      },
      {
        question: "How is bare metal sold on VirtEngine?",
        answer:
          "As an IaaS listing that states the machine class, location and availability terms. Orders are matched with both parties identity-verified, backed by funded escrow, and settled from metered, signed usage records over the lease.",
      },
    ],
    related: [
      "what-is-a-virtual-machine",
      "what-is-iaas",
      "what-is-containerization",
      "what-is-private-cloud-software",
    ],
    funnel: { label: "Bare metal as a listing", href: "/marketplace/iaas" },
    practice:
      "A provider lists one machine class with its memory, storage and network stated plainly; the tenant reserves that exact box, funds escrow, and settles from the hours it runs.",
  },
];
