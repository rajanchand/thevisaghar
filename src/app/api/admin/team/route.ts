import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { teamMemberSchema } from "@/lib/validations";
import { logAudit } from "@/lib/audit";

// GET all team members for administration
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const team = await prisma.teamMember.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json(team);
  } catch (error) {
    console.error("[Admin Team GET Error]:", error);
    return NextResponse.json(
      { error: "Failed to fetch team members" },
      { status: 500 }
    );
  }
}

// POST create a new team member
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = teamMemberSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validatedData.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const member = await prisma.teamMember.create({
      data: validatedData.data,
    });

    // Audit log
    await logAudit({
      action: "CREATE",
      entity: "TeamMember",
      entityId: member.id,
      userId: session.user.id,
      details: { name: member.name, role: member.role },
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    console.error("[Admin Team POST Error]:", error);
    return NextResponse.json(
      { error: "Failed to create team member" },
      { status: 500 }
    );
  }
}
