"use client";
import { useEffect, useRef } from "react";
import Shepherd from "shepherd.js";

export function startAdminTour() {
  const tour = new Shepherd.Tour({
    useModalOverlay: true,
    defaultStepOptions: {
      classes: "shepherd-theme-custom",
      scrollTo: { behavior: "smooth", block: "center" },
      cancelIcon: {
        enabled: true,
      },
    },
  });

  tour.addStep({
    id: "welcome",
    title: "👋 Welcome to Jeffrey CMS Admin Panel",
    text: "This guided tour director will quickly walk you through the core sections of your portfolio administration dashboard.",
    buttons: [
      {
        text: "Skip Tour",
        action: () => {
          localStorage.setItem("admin_tour_completed", "true");
          tour.cancel();
        },
        classes: "shepherd-button-secondary",
      },
      {
        text: "Start Tour →",
        action: tour.next,
        classes: "shepherd-button-primary",
      },
    ],
  });

  tour.addStep({
    id: "sidebar-nav",
    attachTo: {
      element: '[data-tour="sidebar-nav"]',
      on: "right",
    },
    title: "🧭 Admin Navigation Sidebar",
    text: "Easily manage Projects, Experience, Skills, Certifications, Profile details, and Client Contact Inquiries.",
    buttons: [
      {
        text: "Back",
        action: tour.back,
        classes: "shepherd-button-secondary",
      },
      {
        text: "Next →",
        action: tour.next,
        classes: "shepherd-button-primary",
      },
    ],
  });

  tour.addStep({
    id: "dashboard-stats",
    attachTo: {
      element: '[data-tour="dashboard-stats"]',
      on: "bottom",
    },
    title: "📊 Quick Analytics & Metrics",
    text: "Get instant visibility into your total projects, featured case studies, published statuses, total skills, and unread messages.",
    buttons: [
      {
        text: "Back",
        action: tour.back,
        classes: "shepherd-button-secondary",
      },
      {
        text: "Next →",
        action: tour.next,
        classes: "shepherd-button-primary",
      },
    ],
  });

  tour.addStep({
    id: "create-project-banner",
    attachTo: {
      element: '[data-tour="create-project-banner"]',
      on: "bottom",
    },
    title: "🚀 Add New Case Study",
    text: "Click here anytime to publish a new SQL, Python, or Power BI analysis with problem statements, datasets, and key findings.",
    buttons: [
      {
        text: "Back",
        action: tour.back,
        classes: "shepherd-button-secondary",
      },
      {
        text: "Next →",
        action: tour.next,
        classes: "shepherd-button-primary",
      },
    ],
  });

  tour.addStep({
    id: "recent-projects",
    attachTo: {
      element: '[data-tour="recent-projects"]',
      on: "top",
    },
    title: "📁 Portfolio Project Management",
    text: "Review draft and published status of your case studies, update tags, categories, or edit details on the fly.",
    buttons: [
      {
        text: "Back",
        action: tour.back,
        classes: "shepherd-button-secondary",
      },
      {
        text: "Next →",
        action: tour.next,
        classes: "shepherd-button-primary",
      },
    ],
  });

  tour.addStep({
    id: "messages-badge",
    attachTo: {
      element: '[data-tour="messages-badge"]',
      on: "right",
    },
    title: "📬 Client Messages & Inquiries",
    text: "Check incoming messages from recruiters, potential clients, and collaborators, with live unread indicators.",
    buttons: [
      {
        text: "Back",
        action: tour.back,
        classes: "shepherd-button-secondary",
      },
      {
        text: "Next →",
        action: tour.next,
        classes: "shepherd-button-primary",
      },
    ],
  });

  tour.addStep({
    id: "public-site-link",
    attachTo: {
      element: '[data-tour="public-site-link"]',
      on: "right",
    },
    title: "🌐 Live Public Site Preview",
    text: "Preview how your updates look on your live public portfolio website with a single click.",
    buttons: [
      {
        text: "Back",
        action: tour.back,
        classes: "shepherd-button-secondary",
      },
      {
        text: "Next →",
        action: tour.next,
        classes: "shepherd-button-primary",
      },
    ],
  });

  tour.addStep({
    id: "tour-director-btn",
    attachTo: {
      element: '[data-tour="tour-director-btn"]',
      on: "bottom",
    },
    title: "✨ Navigation Director Ready!",
    text: "You are all set! You can restart this guided tour anytime by clicking the 'Take Tour' button right here in the header.",
    buttons: [
      {
        text: "Back",
        action: tour.back,
        classes: "shepherd-button-secondary",
      },
      {
        text: "Finish Tour 🎉",
        action: () => {
          localStorage.setItem("admin_tour_completed", "true");
          tour.complete();
        },
        classes: "shepherd-button-primary",
      },
    ],
  });

  tour.on("complete", () => {
    localStorage.setItem("admin_tour_completed", "true");
  });

  tour.on("cancel", () => {
    localStorage.setItem("admin_tour_completed", "true");
  });

  tour.start();
  return tour;
}

interface AdminTourDirectorProps {
  autoStart?: boolean;
}

export default function AdminTourDirector({ autoStart = true }: AdminTourDirectorProps) {
  const startedRef = useRef(false);

  useEffect(() => {
    if (!autoStart || startedRef.current) return;

    const timer = setTimeout(() => {
      const hasCompleted = localStorage.getItem("admin_tour_completed");
      if (!hasCompleted) {
        startedRef.current = true;
        startAdminTour();
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [autoStart]);

  return null;
}
