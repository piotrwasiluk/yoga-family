import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      common: {
        loading: "Loading...",
        error: "Something went wrong",
        retry: "Retry",
        cancel: "Cancel",
        save: "Save",
        done: "Done",
        delete: "Delete",
      },
      auth: {
        login: "Log In",
        register: "Sign Up",
        email: "Email",
        password: "Password",
        displayName: "Display Name",
        noAccount: "Don't have an account?",
        hasAccount: "Already have an account?",
        signUpLink: "Sign up",
        loginLink: "Log in",
      },
      home: {
        greeting: "Hey, {{name}}!",
        markDone: "Mark Today as Done",
        currentStreak: "Current Streak",
        longestStreak: "Longest Streak",
        days: "days",
        todayStatus: "Today's Activity",
        noneCompleted: "No one has checked in yet today",
      },
      checkin: {
        title: "How was your session?",
        feeling: {
          great: "Great",
          good: "Good",
          tough: "Tough",
          sore: "Sore",
        },
        notesPlaceholder: "Any notes about your session? (optional)",
        submit: "Check In",
        success: "Session logged!",
      },
      group: {
        title: "Group",
        members: "Members",
        invite: "Invite",
        inviteCode: "Invite Code",
        joinGroup: "Join Group",
        enterCode: "Enter invite code",
        join: "Join",
        streak: "{{count}} day streak",
        completedToday: "Done today",
        notCompletedToday: "Not yet today",
        noGroup: "You're not in a group yet",
        createGroup: "Create Group",
        groupName: "Group Name",
        create: "Create",
      },
      plan: {
        title: "Workout Plans",
        comingSoon: "Workout plans coming soon!",
      },
      alerts: {
        title: "Notifications",
        comingSoon: "Notification settings coming soon!",
      },
      tabs: {
        home: "Home",
        group: "Group",
        plan: "Plan",
        alerts: "Alerts",
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
