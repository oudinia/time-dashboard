import { PrismaClient } from '@prisma/client';
import Holidays from 'date-holidays';

const prisma = new PrismaClient();

// All countries grouped by continent
const COUNTRIES_BY_CONTINENT = {
  'North America': [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'MX', name: 'Mexico' },
    { code: 'GT', name: 'Guatemala' },
    { code: 'CU', name: 'Cuba' },
    { code: 'HT', name: 'Haiti' },
    { code: 'DO', name: 'Dominican Republic' },
    { code: 'HN', name: 'Honduras' },
    { code: 'NI', name: 'Nicaragua' },
    { code: 'SV', name: 'El Salvador' },
    { code: 'CR', name: 'Costa Rica' },
    { code: 'PA', name: 'Panama' },
    { code: 'JM', name: 'Jamaica' },
    { code: 'TT', name: 'Trinidad and Tobago' },
    { code: 'BS', name: 'Bahamas' },
    { code: 'BB', name: 'Barbados' },
    { code: 'BZ', name: 'Belize' },
    { code: 'PR', name: 'Puerto Rico' },
  ],
  'South America': [
    { code: 'BR', name: 'Brazil' },
    { code: 'AR', name: 'Argentina' },
    { code: 'CO', name: 'Colombia' },
    { code: 'PE', name: 'Peru' },
    { code: 'VE', name: 'Venezuela' },
    { code: 'CL', name: 'Chile' },
    { code: 'EC', name: 'Ecuador' },
    { code: 'BO', name: 'Bolivia' },
    { code: 'PY', name: 'Paraguay' },
    { code: 'UY', name: 'Uruguay' },
    { code: 'GY', name: 'Guyana' },
    { code: 'SR', name: 'Suriname' },
  ],
  'Europe': [
    { code: 'GB', name: 'United Kingdom' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'IT', name: 'Italy' },
    { code: 'ES', name: 'Spain' },
    { code: 'PL', name: 'Poland' },
    { code: 'RO', name: 'Romania' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'BE', name: 'Belgium' },
    { code: 'CZ', name: 'Czech Republic' },
    { code: 'GR', name: 'Greece' },
    { code: 'PT', name: 'Portugal' },
    { code: 'SE', name: 'Sweden' },
    { code: 'HU', name: 'Hungary' },
    { code: 'AT', name: 'Austria' },
    { code: 'CH', name: 'Switzerland' },
    { code: 'BG', name: 'Bulgaria' },
    { code: 'DK', name: 'Denmark' },
    { code: 'FI', name: 'Finland' },
    { code: 'SK', name: 'Slovakia' },
    { code: 'NO', name: 'Norway' },
    { code: 'IE', name: 'Ireland' },
    { code: 'HR', name: 'Croatia' },
    { code: 'LT', name: 'Lithuania' },
    { code: 'SI', name: 'Slovenia' },
    { code: 'LV', name: 'Latvia' },
    { code: 'EE', name: 'Estonia' },
    { code: 'CY', name: 'Cyprus' },
    { code: 'LU', name: 'Luxembourg' },
    { code: 'MT', name: 'Malta' },
    { code: 'IS', name: 'Iceland' },
    { code: 'AL', name: 'Albania' },
    { code: 'RS', name: 'Serbia' },
    { code: 'ME', name: 'Montenegro' },
    { code: 'MK', name: 'North Macedonia' },
    { code: 'BA', name: 'Bosnia and Herzegovina' },
    { code: 'MD', name: 'Moldova' },
    { code: 'UA', name: 'Ukraine' },
    { code: 'BY', name: 'Belarus' },
    { code: 'RU', name: 'Russia' },
    { code: 'MC', name: 'Monaco' },
    { code: 'LI', name: 'Liechtenstein' },
    { code: 'AD', name: 'Andorra' },
    { code: 'SM', name: 'San Marino' },
    { code: 'VA', name: 'Vatican City' },
  ],
  'Asia': [
    { code: 'CN', name: 'China' },
    { code: 'IN', name: 'India' },
    { code: 'ID', name: 'Indonesia' },
    { code: 'PK', name: 'Pakistan' },
    { code: 'BD', name: 'Bangladesh' },
    { code: 'JP', name: 'Japan' },
    { code: 'PH', name: 'Philippines' },
    { code: 'VN', name: 'Vietnam' },
    { code: 'TR', name: 'Turkey' },
    { code: 'IR', name: 'Iran' },
    { code: 'TH', name: 'Thailand' },
    { code: 'MM', name: 'Myanmar' },
    { code: 'KR', name: 'South Korea' },
    { code: 'IQ', name: 'Iraq' },
    { code: 'AF', name: 'Afghanistan' },
    { code: 'SA', name: 'Saudi Arabia' },
    { code: 'UZ', name: 'Uzbekistan' },
    { code: 'MY', name: 'Malaysia' },
    { code: 'NP', name: 'Nepal' },
    { code: 'YE', name: 'Yemen' },
    { code: 'KP', name: 'North Korea' },
    { code: 'TW', name: 'Taiwan' },
    { code: 'SY', name: 'Syria' },
    { code: 'LK', name: 'Sri Lanka' },
    { code: 'KZ', name: 'Kazakhstan' },
    { code: 'KH', name: 'Cambodia' },
    { code: 'JO', name: 'Jordan' },
    { code: 'AZ', name: 'Azerbaijan' },
    { code: 'AE', name: 'United Arab Emirates' },
    { code: 'TJ', name: 'Tajikistan' },
    { code: 'IL', name: 'Israel' },
    { code: 'HK', name: 'Hong Kong' },
    { code: 'LA', name: 'Laos' },
    { code: 'LB', name: 'Lebanon' },
    { code: 'KG', name: 'Kyrgyzstan' },
    { code: 'TM', name: 'Turkmenistan' },
    { code: 'SG', name: 'Singapore' },
    { code: 'OM', name: 'Oman' },
    { code: 'PS', name: 'Palestine' },
    { code: 'KW', name: 'Kuwait' },
    { code: 'GE', name: 'Georgia' },
    { code: 'MN', name: 'Mongolia' },
    { code: 'AM', name: 'Armenia' },
    { code: 'QA', name: 'Qatar' },
    { code: 'BH', name: 'Bahrain' },
    { code: 'BN', name: 'Brunei' },
    { code: 'BT', name: 'Bhutan' },
    { code: 'MO', name: 'Macau' },
    { code: 'MV', name: 'Maldives' },
  ],
  'Africa': [
    { code: 'NG', name: 'Nigeria' },
    { code: 'ET', name: 'Ethiopia' },
    { code: 'EG', name: 'Egypt' },
    { code: 'CD', name: 'DR Congo' },
    { code: 'TZ', name: 'Tanzania' },
    { code: 'ZA', name: 'South Africa' },
    { code: 'KE', name: 'Kenya' },
    { code: 'UG', name: 'Uganda' },
    { code: 'DZ', name: 'Algeria' },
    { code: 'SD', name: 'Sudan' },
    { code: 'MA', name: 'Morocco' },
    { code: 'AO', name: 'Angola' },
    { code: 'MZ', name: 'Mozambique' },
    { code: 'GH', name: 'Ghana' },
    { code: 'MG', name: 'Madagascar' },
    { code: 'CM', name: 'Cameroon' },
    { code: 'CI', name: 'Ivory Coast' },
    { code: 'NE', name: 'Niger' },
    { code: 'BF', name: 'Burkina Faso' },
    { code: 'ML', name: 'Mali' },
    { code: 'MW', name: 'Malawi' },
    { code: 'ZM', name: 'Zambia' },
    { code: 'SN', name: 'Senegal' },
    { code: 'TD', name: 'Chad' },
    { code: 'SO', name: 'Somalia' },
    { code: 'ZW', name: 'Zimbabwe' },
    { code: 'GN', name: 'Guinea' },
    { code: 'RW', name: 'Rwanda' },
    { code: 'BJ', name: 'Benin' },
    { code: 'BI', name: 'Burundi' },
    { code: 'TN', name: 'Tunisia' },
    { code: 'SS', name: 'South Sudan' },
    { code: 'TG', name: 'Togo' },
    { code: 'SL', name: 'Sierra Leone' },
    { code: 'LY', name: 'Libya' },
    { code: 'CG', name: 'Congo' },
    { code: 'LR', name: 'Liberia' },
    { code: 'CF', name: 'Central African Republic' },
    { code: 'MR', name: 'Mauritania' },
    { code: 'ER', name: 'Eritrea' },
    { code: 'NA', name: 'Namibia' },
    { code: 'GM', name: 'Gambia' },
    { code: 'BW', name: 'Botswana' },
    { code: 'GA', name: 'Gabon' },
    { code: 'LS', name: 'Lesotho' },
    { code: 'GW', name: 'Guinea-Bissau' },
    { code: 'GQ', name: 'Equatorial Guinea' },
    { code: 'MU', name: 'Mauritius' },
    { code: 'SZ', name: 'Eswatini' },
    { code: 'DJ', name: 'Djibouti' },
    { code: 'CV', name: 'Cape Verde' },
    { code: 'SC', name: 'Seychelles' },
  ],
  'Oceania': [
    { code: 'AU', name: 'Australia' },
    { code: 'NZ', name: 'New Zealand' },
    { code: 'PG', name: 'Papua New Guinea' },
    { code: 'FJ', name: 'Fiji' },
    { code: 'SB', name: 'Solomon Islands' },
    { code: 'VU', name: 'Vanuatu' },
    { code: 'WS', name: 'Samoa' },
    { code: 'KI', name: 'Kiribati' },
    { code: 'TO', name: 'Tonga' },
    { code: 'FM', name: 'Micronesia' },
    { code: 'PW', name: 'Palau' },
    { code: 'MH', name: 'Marshall Islands' },
    { code: 'NR', name: 'Nauru' },
    { code: 'TV', name: 'Tuvalu' },
    { code: 'NC', name: 'New Caledonia' },
    { code: 'PF', name: 'French Polynesia' },
    { code: 'GU', name: 'Guam' },
  ],
};

// Flatten all countries
const ALL_COUNTRIES = Object.entries(COUNTRIES_BY_CONTINENT).flatMap(
  ([continent, countries]) =>
    countries.map((c) => ({ ...c, continent }))
);

async function main() {
  console.log('Seeding database...');
  console.log(`Total countries to seed: ${ALL_COUNTRIES.length}`);

  // Clear existing data
  console.log('Clearing existing data...');
  await prisma.holiday.deleteMany();
  await prisma.country.deleteMany();

  // Seed countries with continent info in name for now
  console.log('Seeding countries...');
  for (const country of ALL_COUNTRIES) {
    await prisma.country.upsert({
      where: { code: country.code },
      update: { name: country.name },
      create: { code: country.code, name: country.name, supported: true },
    });
  }
  console.log(`Seeded ${ALL_COUNTRIES.length} countries`);

  // Get current year and generate 5 years of holidays
  const currentYear = new Date().getFullYear();
  const years = [
    currentYear - 1,
    currentYear,
    currentYear + 1,
    currentYear + 2,
    currentYear + 3,
  ];

  console.log('Seeding holidays...');
  let holidayCount = 0;
  let skippedCountries: string[] = [];

  for (const [continent, countries] of Object.entries(COUNTRIES_BY_CONTINENT)) {
    console.log(`\nProcessing ${continent}...`);

    for (const country of countries) {
      try {
        const hd = new Holidays(country.code);
        let countryHolidayCount = 0;

        for (const year of years) {
          const holidays = hd.getHolidays(year) || [];
          const publicHolidays = holidays.filter((h) => h.type === 'public');

          for (const holiday of publicHolidays) {
            try {
              await prisma.holiday.upsert({
                where: {
                  countryCode_date_name: {
                    countryCode: country.code,
                    date: new Date(holiday.date),
                    name: holiday.name,
                  },
                },
                update: {},
                create: {
                  countryCode: country.code,
                  name: holiday.name,
                  date: new Date(holiday.date),
                  type: 'public',
                  year: year,
                },
              });
              holidayCount++;
              countryHolidayCount++;
            } catch {
              // Skip duplicates or invalid dates
            }
          }
        }
        console.log(`  ${country.name}: ${countryHolidayCount} holidays`);
      } catch (e) {
        skippedCountries.push(country.name);
        console.log(`  ${country.name}: SKIPPED (not supported)`);
      }
    }
  }

  console.log(`\n========================================`);
  console.log(`Seeded ${holidayCount} holidays for ${ALL_COUNTRIES.length - skippedCountries.length} countries`);
  if (skippedCountries.length > 0) {
    console.log(`Skipped ${skippedCountries.length} countries without holiday data`);
  }
  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
