import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const userPasswordHash = await bcrypt.hash("password123", 10);

  await prisma.auditEvent.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.emailLog.deleteMany();
  await prisma.task.deleteMany();
  await prisma.note.deleteMany();
  await prisma.opportunity.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.company.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.pipelineStage.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: "admin@crm.local",
        passwordHash: userPasswordHash,
        firstName: "Avery",
        lastName: "Admin",
        role: "SYSTEM_ADMIN"
      }
    }),
    prisma.user.create({
      data: {
        email: "manager@crm.local",
        passwordHash: userPasswordHash,
        firstName: "Mina",
        lastName: "Manager",
        role: "SALES_MANAGER"
      }
    }),
    prisma.user.create({
      data: {
        email: "rep@crm.local",
        passwordHash: userPasswordHash,
        firstName: "Eli",
        lastName: "Rubin-Calvert",
        role: "SALES_REP"
      }
    }),
    prisma.user.create({
      data: {
        email: "account@crm.local",
        passwordHash: userPasswordHash,
        firstName: "Jordan",
        lastName: "Account",
        role: "ACCOUNT_MANAGER"
      }
    }),
    prisma.user.create({
      data: {
        email: "exec@crm.local",
        passwordHash: userPasswordHash,
        firstName: "Sonia",
        lastName: "Executive",
        role: "EXECUTIVE_VIEWER"
      }
    }),
    prisma.user.create({
      data: {
        email: "readonly@crm.local",
        passwordHash: userPasswordHash,
        firstName: "Riley",
        lastName: "Viewer",
        role: "READ_ONLY"
      }
    })
  ]);

  const [admin, manager, rep, accountManager] = users;

  const stages = await Promise.all([
    prisma.pipelineStage.create({
      data: { name: "New Opportunity", sortOrder: 1, probability: 10 }
    }),
    prisma.pipelineStage.create({
      data: { name: "Discovery", sortOrder: 2, probability: 25 }
    }),
    prisma.pipelineStage.create({
      data: { name: "Proposal Sent", sortOrder: 3, probability: 50 }
    }),
    prisma.pipelineStage.create({
      data: { name: "Negotiation", sortOrder: 4, probability: 75 }
    }),
    prisma.pipelineStage.create({
      data: { name: "Closed Won", sortOrder: 5, probability: 100, isWonStage: true }
    }),
    prisma.pipelineStage.create({
      data: { name: "Closed Lost", sortOrder: 6, probability: 0, isLostStage: true }
    })
  ]);

  const [newStage, discoveryStage, proposalStage, negotiationStage, wonStage, lostStage] = stages;

  const northstar = await prisma.company.create({
    data: {
      name: "Northstar Dental Clinic",
      domain: "northstardental.com",
      industry: "Healthcare",
      size: "SMALL",
      phone: "555-100-2000",
      website: "https://northstardental.com"
    }
  });

  const atlas = await prisma.company.create({
    data: {
      name: "Atlas Industrial Parts",
      domain: "atlasparts.io",
      industry: "Manufacturing",
      size: "MID_MARKET",
      phone: "555-300-4000",
      website: "https://atlasparts.io"
    }
  });

  const contacts = await Promise.all([
    prisma.contact.create({
      data: {
        firstName: "Maria",
        lastName: "Santos",
        email: "maria@northstardental.com",
        phone: "555-444-1000",
        jobTitle: "Practice Manager",
        companyId: northstar.id
      }
    }),
    prisma.contact.create({
      data: {
        firstName: "Devin",
        lastName: "Cole",
        email: "devin@atlasparts.io",
        phone: "555-222-9000",
        jobTitle: "Operations Director",
        companyId: atlas.id
      }
    })
  ]);

  const [maria, devin] = contacts;

  const leads = await Promise.all([
    prisma.lead.create({
      data: {
        firstName: "Nina",
        lastName: "Park",
        email: "nina@oakandriver.co",
        phone: "555-777-0001",
        companyName: "Oak and River Studio",
        jobTitle: "Founder",
        source: "WEBSITE",
        status: "NEW",
        ownerId: rep.id
      }
    }),
    prisma.lead.create({
      data: {
        firstName: "Marcus",
        lastName: "Hill",
        email: "marcus@millstonelegal.com",
        phone: "555-777-0002",
        companyName: "Millstone Legal",
        jobTitle: "Managing Partner",
        source: "REFERRAL",
        status: "QUALIFIED",
        ownerId: manager.id
      }
    }),
    prisma.lead.create({
      data: {
        firstName: "Priya",
        lastName: "Shah",
        email: "priya@brightgrid.ai",
        companyName: "BrightGrid AI",
        source: "EVENT",
        status: "CONTACTED",
        ownerId: accountManager.id
      }
    })
  ]);

  const opportunities = await Promise.all([
    prisma.opportunity.create({
      data: {
        name: "Northstar Website Redesign",
        description: "Redesign and patient conversion optimization",
        valueCents: 850000,
        status: "OPEN",
        companyId: northstar.id,
        contactId: maria.id,
        stageId: proposalStage.id,
        ownerId: rep.id,
        expectedCloseDate: new Date("2026-06-30T00:00:00.000Z")
      }
    }),
    prisma.opportunity.create({
      data: {
        name: "Atlas CRM Migration",
        description: "Multi-team CRM migration and onboarding",
        valueCents: 1850000,
        status: "OPEN",
        companyId: atlas.id,
        contactId: devin.id,
        stageId: negotiationStage.id,
        ownerId: manager.id,
        expectedCloseDate: new Date("2026-07-15T00:00:00.000Z")
      }
    }),
    prisma.opportunity.create({
      data: {
        name: "Pilot Retainer Expansion",
        description: "Existing customer expansion opportunity",
        valueCents: 320000,
        status: "WON",
        companyId: northstar.id,
        contactId: maria.id,
        stageId: wonStage.id,
        ownerId: accountManager.id,
        expectedCloseDate: new Date("2026-05-10T00:00:00.000Z"),
        closedAt: new Date("2026-05-10T00:00:00.000Z")
      }
    }),
    prisma.opportunity.create({
      data: {
        name: "Legacy Intake Portal Replacement",
        description: "Lost against internal build option",
        valueCents: 640000,
        status: "LOST",
        companyId: atlas.id,
        contactId: devin.id,
        stageId: lostStage.id,
        ownerId: manager.id,
        expectedCloseDate: new Date("2026-04-18T00:00:00.000Z"),
        closedAt: new Date("2026-04-18T00:00:00.000Z"),
        lostReason: "Budget shifted to internal tooling"
      }
    }),
    prisma.opportunity.create({
      data: {
        name: "Qualified Lead Discovery Call",
        description: "Placeholder for future converted lead",
        valueCents: 500000,
        status: "OPEN",
        stageId: discoveryStage.id,
        ownerId: manager.id,
        expectedCloseDate: new Date("2026-08-01T00:00:00.000Z")
      }
    }),
    prisma.opportunity.create({
      data: {
        name: "Fresh Demo Slot",
        description: "New opportunity without associated company yet",
        valueCents: 120000,
        status: "OPEN",
        stageId: newStage.id,
        ownerId: rep.id
      }
    })
  ]);

  await prisma.note.createMany({
    data: [
      {
        body: "Lead asked for examples of healthcare client work.",
        authorId: rep.id,
        leadId: leads[0].id
      },
      {
        body: "Proposal deck shared and pricing conversation started.",
        authorId: rep.id,
        opportunityId: opportunities[0].id,
        companyId: northstar.id,
        contactId: maria.id
      },
      {
        body: "Operations team wants migration risk analysis before legal review.",
        authorId: manager.id,
        opportunityId: opportunities[1].id,
        companyId: atlas.id,
        contactId: devin.id
      }
    ]
  });

  await prisma.task.createMany({
    data: [
      {
        title: "Follow up on website lead",
        description: "Schedule initial discovery call",
        status: "TODO",
        dueDate: new Date("2026-05-20T17:00:00.000Z"),
        assignedToId: rep.id,
        createdById: manager.id,
        leadId: leads[0].id
      },
      {
        title: "Prepare Atlas pricing revision",
        status: "IN_PROGRESS",
        dueDate: new Date("2026-05-21T17:00:00.000Z"),
        assignedToId: manager.id,
        createdById: admin.id,
        opportunityId: opportunities[1].id,
        companyId: atlas.id
      },
      {
        title: "Send onboarding recap",
        status: "COMPLETED",
        dueDate: new Date("2026-05-12T17:00:00.000Z"),
        assignedToId: accountManager.id,
        createdById: accountManager.id,
        opportunityId: opportunities[2].id,
        companyId: northstar.id,
        contactId: maria.id,
        completedAt: new Date("2026-05-11T15:00:00.000Z")
      }
    ]
  });

  await prisma.emailLog.createMany({
    data: [
      {
        subject: "Northstar proposal follow-up",
        bodyPreview: "Wanted to answer your timeline questions and next steps.",
        direction: "OUTBOUND",
        sentAt: new Date("2026-05-18T18:15:00.000Z"),
        fromEmail: "eli@crm.local",
        toEmail: "maria@northstardental.com",
        companyId: northstar.id,
        contactId: maria.id,
        opportunityId: opportunities[0].id,
        loggedById: rep.id
      },
      {
        subject: "Atlas legal review requested",
        bodyPreview: "Please send over the migration assumptions document.",
        direction: "INBOUND",
        sentAt: new Date("2026-05-17T14:30:00.000Z"),
        fromEmail: "devin@atlasparts.io",
        toEmail: "mina@crm.local",
        companyId: atlas.id,
        contactId: devin.id,
        opportunityId: opportunities[1].id,
        loggedById: manager.id
      }
    ]
  });

  await prisma.activity.createMany({
    data: [
      {
        type: "LEAD_CREATED",
        actorId: rep.id,
        leadId: leads[0].id,
        description: "Lead created from website form"
      },
      {
        type: "LEAD_CREATED",
        actorId: manager.id,
        leadId: leads[1].id,
        description: "Lead entered from partner referral"
      },
      {
        type: "COMPANY_CREATED",
        actorId: admin.id,
        companyId: northstar.id,
        description: "Company imported during CRM setup"
      },
      {
        type: "CONTACT_CREATED",
        actorId: admin.id,
        contactId: maria.id,
        companyId: northstar.id,
        description: "Primary contact created for Northstar Dental Clinic"
      },
      {
        type: "OPPORTUNITY_CREATED",
        actorId: rep.id,
        opportunityId: opportunities[0].id,
        companyId: northstar.id,
        contactId: maria.id,
        description: "Opportunity created for redesign project"
      },
      {
        type: "OPPORTUNITY_STAGE_CHANGED",
        actorId: rep.id,
        opportunityId: opportunities[0].id,
        companyId: northstar.id,
        contactId: maria.id,
        description: "Opportunity moved into Proposal Sent",
        metadata: {
          oldStage: "Discovery",
          newStage: "Proposal Sent"
        }
      },
      {
        type: "TASK_COMPLETED",
        actorId: accountManager.id,
        opportunityId: opportunities[2].id,
        companyId: northstar.id,
        contactId: maria.id,
        description: "Onboarding recap task completed"
      },
      {
        type: "EMAIL_LOGGED",
        actorId: manager.id,
        opportunityId: opportunities[1].id,
        companyId: atlas.id,
        contactId: devin.id,
        description: "Inbound legal review email logged"
      }
    ]
  });

  await prisma.auditEvent.createMany({
    data: [
      {
        actorId: admin.id,
        entityType: "Seed",
        entityId: "initial-dataset",
        action: "SEED_COMPLETED",
        metadata: {
          users: users.length,
          stages: stages.length,
          companies: 2,
          opportunities: opportunities.length
        }
      },
      {
        actorId: rep.id,
        entityType: "Opportunity",
        entityId: opportunities[0].id,
        action: "OPPORTUNITY_STAGE_CHANGED",
        metadata: {
          stage: "Proposal Sent"
        }
      }
    ]
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
