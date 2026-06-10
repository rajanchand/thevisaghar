import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { teamMemberSchema } from "@/lib/validations";
import { logAudit } from "@/lib/audit";

// PUT update team member by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = teamMemberSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validatedData.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Verify team member exists
    const memberExists = await prisma.teamMember.findUnique({
      where: { id },
    });

    if (!memberExists) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 });
    }

    const updatedMember = await prisma.teamMember.update({
      where: { id },
      data: validatedData.data,
    });

    // Audit log
    await logAudit({
      action: "UPDATE",
      entity: "TeamMember",
      entityId: id,
      userId: session.user.id,
      details: { name: updatedMember.name, role: updatedMember.role },
    });

    return NextResponse.json(updatedMember);
  } catch (error) {
    console.error("[Admin Team PUT Error]:", error);
    return NextResponse.json(
      { error: "Failed to update team member" },
      { status: 500 }
    );
  }
}

// DELETE team member by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    // Verify team member exists
    const member = await prisma.teamMember.findUnique({
      where: { id },
    });

    if (!member) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 });
    }

    await prisma.teamMember.delete({
      where: { id },
    });

    // Audit log
    await logAudit({
      action: "DELETE",
      entity: "TeamMember",
      entityId: id,
      userId: session.user.id,
      details: { name: member.name, role: member.role },
    });

    return NextResponse.json({ success: true, message: "Team member deleted successfully" });
  } catch (error) {
    console.error("[Admin Team DELETE Error]:", error);
    return NextResponse.json(
      { error: "Failed to delete team member" },
      { status: 500 }
    );
  }
}
