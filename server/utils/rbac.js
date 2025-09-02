// Project RBAC helpers
function isProjectMember(userId, project) {
  if (!project || !project.teamMembers) return false;
  return project.teamMembers.some(
    (m) => m.user.toString() === userId.toString()
  );
}
function isProjectOwner(userId, project) {
  if (!project || !project.teamMembers) return false;
  return project.teamMembers.some(
    (m) => m.user.toString() === userId.toString() && m.role === "Owner"
  );
}
module.exports = { isProjectMember, isProjectOwner };
