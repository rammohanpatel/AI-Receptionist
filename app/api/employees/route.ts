import { NextRequest, NextResponse } from 'next/server';
import { EMPLOYEES } from '@/lib/employees';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    employees: EMPLOYEES,
    success: true
  });
}
