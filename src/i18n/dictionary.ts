export interface Dictionary {
  appName: string;
  nav: {
    dashboard: string;
    statistics: string;
    associations: string;
    mediaBuyers: string;
    platforms: string;
    auditLogs: string;
    signOut: string;
  };
  login: {
    title: string;
    subtitle: string;
    email: string;
    password: string;
    submit: string;
    submitting: string;
    invalidCredentials: string;
    accountDisabled: string;
    genericError: string;
  };
  forbidden: {
    title: string;
    subtitle: string;
    backHome: string;
  };
  common: {
    save: string;
    cancel: string;
    edit: string;
    delete: string;
    create: string;
    confirmDeleteTitle: string;
    confirmDeleteBody: string;
    active: string;
    inactive: string;
    loading: string;
    noData: string;
    savedSuccessfully: string;
    errorOccurred: string;
    all: string;
    from: string;
    to: string;
    language: string;
    actions: string;
    notes: string;
    optional: string;
  };
  dashboard: {
    title: string;
    totalBudget: string;
    totalSpent: string;
    remainingBudget: string;
    donationCount: string;
    donationValue: string;
    advertisingReturn: string;
    associationReturn: string;
    avgRoas: string;
    chartTitle: string;
    latestEntries: string;
    filters: string;
  };
  statistics: {
    title: string;
    new: string;
    edit: string;
    association: string;
    platform: string;
    periodStart: string;
    periodEnd: string;
    currency: string;
    budget: string;
    amountSpent: string;
    donationCount: string;
    donationValue: string;
    advertisingReturn: string;
    associationReturn: string;
    remaining: string;
    spendPct: string;
    roas: string;
    avgDonation: string;
    createdBy: string;
    period: string;
  };
  associations: {
    title: string;
    new: string;
    edit: string;
    name: string;
    code: string;
    description: string;
    status: string;
    platformsLinked: string;
    mediaBuyersLinked: string;
  };
  mediaBuyers: {
    title: string;
    new: string;
    edit: string;
    fullName: string;
    email: string;
    password: string;
    status: string;
    associationsAssigned: string;
  };
  platforms: {
    title: string;
    new: string;
    name: string;
    slug: string;
  };
  auditLogs: {
    title: string;
    actor: string;
    action: string;
    table: string;
    record: string;
    date: string;
  };
}
