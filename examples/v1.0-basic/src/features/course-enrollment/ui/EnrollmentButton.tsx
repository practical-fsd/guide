// Course enrollment feature
// ✅ User scenario: enrolling in a course
'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/common/Button';

type EnrollmentButtonProps = {
  courseId: string;
  courseName: string;
};

export function EnrollmentButton({ courseId, courseName }: EnrollmentButtonProps) {
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const handleEnroll = async () => {
    setIsEnrolling(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsEnrolled(true);
    setIsEnrolling(false);

    // In real app: call API, show toast notification, etc.
    console.log(`Enrolled in course: ${courseId}`);
  };

  if (isEnrolled) {
    return (
      <Button variant="secondary" disabled>
        ✓ Enrolled
      </Button>
    );
  }

  return (
    <Button
      onClick={handleEnroll}
      disabled={isEnrolling}
    >
      {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
    </Button>
  );
}
