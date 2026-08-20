import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health/health.module';
import { PlatformConfigModule } from './modules/platform-config/platform-config.module';
import { RbacModule } from './modules/rbac/rbac.module';
import { IdentityModule } from './modules/identity/identity.module';
import { AuditModule } from './modules/audit/audit.module';
import { FilesModule } from './modules/files/files.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { CmsPagesModule } from './modules/cms-pages/cms-pages.module';
import { ProgramsModule } from './modules/programs/programs.module';
import { MentorsDirectoryModule } from './modules/mentors-directory/mentors-directory.module';
import { BlogModule } from './modules/blog/blog.module';
import { MarketingExtrasModule } from './modules/marketing-extras/marketing-extras.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { StudentDashboardModule } from './modules/student-dashboard/student-dashboard.module';
import { LearningCoursesModule } from './modules/learning-courses/learning-courses.module';
import { LearningLessonsModule } from './modules/learning-lessons/learning-lessons.module';
import { LearningAssignmentsModule } from './modules/learning-assignments/learning-assignments.module';
import { LearningQuizzesModule } from './modules/learning-quizzes/learning-quizzes.module';
import { StudentProfileModule } from './modules/student-profile/student-profile.module';
import { InternshipsModule } from './modules/internships/internships.module';
import { InternshipsBrowseModule } from './modules/internships-browse/internships-browse.module';
import { InternshipsApplyModule } from './modules/internships-apply/internships-apply.module';
import { CertificatesModule } from './modules/certificates/certificates.module';
import { ComingSoonModule } from './modules/coming-soon/coming-soon.module';
import { AiChatModule } from './modules/ai-chat/ai-chat.module';
import { MentorsModule } from './modules/mentors/mentors.module';
import { MentorDashboardModule } from './modules/mentor-dashboard/mentor-dashboard.module';
import { AdminDashboardModule } from './modules/admin-dashboard/admin-dashboard.module';
import { ParentPortalModule } from './modules/parent-portal/parent-portal.module';
import { CompanyPortalModule } from './modules/company-portal/company-portal.module';
import { ApprovalsModule } from './modules/approvals/approvals.module';
import { CommunityModule } from './modules/community/community.module';
import { AnalyticsCoreModule } from './modules/analytics-core/analytics-core.module';
import { SuperAdminModule } from './modules/super-admin/super-admin.module';
import { AiCareerCoachModule } from './modules/ai-career-coach/ai-career-coach.module';
import { AiResumeModule } from './modules/ai-resume/ai-resume.module';
import { AiRoadmapModule } from './modules/ai-roadmap/ai-roadmap.module';

@Module({
  imports: [
    HealthModule,
    PlatformConfigModule,
    RbacModule,
    IdentityModule,
    AuditModule,
    FilesModule,
    NotificationsModule,
    CmsPagesModule,
    ProgramsModule,
    MentorsDirectoryModule,
    BlogModule,
    MarketingExtrasModule,
    CatalogModule,
    StudentDashboardModule,
    LearningCoursesModule,
    LearningLessonsModule,
    LearningAssignmentsModule,
    LearningQuizzesModule,
    StudentProfileModule,
    InternshipsModule,
    InternshipsBrowseModule,
    InternshipsApplyModule,
    CertificatesModule,
    ComingSoonModule,
    AiChatModule,
    MentorsModule,
    MentorDashboardModule,
    AdminDashboardModule,
    ParentPortalModule,
    CompanyPortalModule,
    // Remaining Phase 2+ scaffolds
    ApprovalsModule,
    CommunityModule,
    AnalyticsCoreModule,
    SuperAdminModule,
    AiCareerCoachModule,
    AiResumeModule,
    AiRoadmapModule,
  ],
})
export class AppModule {}
