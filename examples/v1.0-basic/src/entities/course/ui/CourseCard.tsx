// Course entity UI component
// ✅ Displays course data, no business logic
import type { Course } from '../model/types';

type CourseCardProps = {
  course: Course;
  onClick?: () => void;
};

export function CourseCard({ course, onClick }: CourseCardProps) {
  return (
    <div
      className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="aspect-video bg-gray-200 rounded mb-3 flex items-center justify-center">
        <span className="text-gray-500">Course Thumbnail</span>
      </div>

      <h3 className="font-semibold text-lg mb-2">{course.title}</h3>

      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
        {course.description}
      </p>

      <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
        <span>{course.instructor}</span>
        <span className="capitalize">{course.level}</span>
      </div>

      <div className="flex items-center justify-between">
        <span className="font-bold text-blue-600">
          ₩{course.price.toLocaleString()}
        </span>
        <span className="text-sm text-gray-500">
          {course.enrolled.toLocaleString()} enrolled
        </span>
      </div>
    </div>
  );
}
