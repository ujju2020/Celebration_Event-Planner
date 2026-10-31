/**
 * Copyright (c) 2026 Ujjwal Kumar Bhowmick
 * - Developer: Ujjwal Kumar Bhowmick
 * - Email: ujjwalkumarbhowmick30@gmail.com
 * - All rights reserved.
 * 
 * Theme Ideation & Creative Content Engine for CelebraTech AI
 * Generates personalized aesthetic themes, color palettes, invitations, and custom event speeches.
 */

import { EventRequest, ThematicConcept, ColorSwatch } from '../types/index.js';

export class ThemeIdeator {
  /**
   * Generates a fully fleshed-out creative theme concept with speeches and invitations
   */
  public static generateConcept(request: EventRequest): ThematicConcept {
    const title = request.title;
    const location = request.location;
    const date = request.targetDate;
    const vibe = request.vibe || 'modern_minimalist';

    const palette = this.getColorPalette(vibe);
    const themeMeta = this.getThemeMetadata(request);
    const invitationCopy = this.generateInvitations(request, themeMeta.themeName);
    const speeches = this.generateSpeeches(request, themeMeta.themeName);
    const playlist = this.getPlaylistVibe(vibe);

    return {
      themeName: themeMeta.themeName,
      tagline: themeMeta.tagline,
      colorPalette: palette,
      decorIdeas: themeMeta.decorIdeas,
      attireCode: themeMeta.attireCode,
      invitationCopy,
      speeches,
      curatedPlaylistVibe: playlist
    };
  }

  private static getColorPalette(vibe: string): ColorSwatch[] {
    switch (vibe) {
      case 'royal_traditional':
        return [
          { name: 'Imperial Crimson', hex: '#8B0000' },
          { name: 'Heritage Gold', hex: '#D4AF37' },
          { name: 'Ivory Pearl', hex: '#FFFFF0' },
          { name: 'Royal Emerald', hex: '#004B23' }
        ];
      case 'bohemian_chic':
        return [
          { name: 'Terracotta Rust', hex: '#E07A5F' },
          { name: 'Sage Leaf', hex: '#81B29A' },
          { name: 'Warm Sand', hex: '#F4F1DE' },
          { name: 'Deep Ochre', hex: '#D4A373' }
        ];
      case 'festive_carnival':
        return [
          { name: 'Sunburst Yellow', hex: '#F9C74F' },
          { name: 'Electric Coral', hex: '#F94144' },
          { name: 'Tropical Teal', hex: '#43AA8B' },
          { name: 'Vibrant Amethyst', hex: '#577590' }
        ];
      case 'retro_vintage':
        return [
          { name: 'Midnight Charcoal', hex: '#2B2D42' },
          { name: 'Rose Gold Shimmer', hex: '#B76E79' },
          { name: 'Champagne Gloss', hex: '#F3E9D2' },
          { name: 'Art-Deco Copper', hex: '#C86D51' }
        ];
      case 'corporate_gala':
        return [
          { name: 'Executive Navy', hex: '#0A192F' },
          { name: 'Platinum Silver', hex: '#C0C0C0' },
          { name: 'Frosted Azure', hex: '#64FFDA' },
          { name: 'Clean Crisp White', hex: '#FFFFFF' }
        ];
      case 'modern_minimalist':
      default:
        return [
          { name: 'Warm Alabaster', hex: '#F8F9FA' },
          { name: 'Nordic Slate', hex: '#495057' },
          { name: 'Champagne Dust', hex: '#E9D8A6' },
          { name: 'Muted Eucalyptus', hex: '#94D2BD' }
        ];
    }
  }

  private static getThemeMetadata(request: EventRequest) {
    if (request.eventType === 'wedding') {
      return {
        themeName: request.vibe === 'royal_traditional' ? 'Ethereal Heritage Royalty' : 'Celestial Modern Romance',
        tagline: 'An everlasting celebration of love, culture, and togetherness',
        decorIdeas: [
          'Floating warm candlelight runners over cascading botanical eucalyptus and blush peonies.',
          'Custom mirrored welcome signage framed with cascading hydrangeas and fairy-lit arches.',
          'Statement crystal or geometric brass chandeliers casting an ambient golden glow.',
          'Interactive polaroid guest book station with personalized metallic ink pens.'
        ],
        attireCode: 'Formal Elegance / Black Tie or Rich Traditional Festive Silks & Tuxedos'
      };
    } else if (request.eventType === 'birthday') {
      return {
        themeName: request.vibe === 'retro_vintage' ? 'Golden Era Speakeasy & Retro Glam' : 'Neon Bloom & Milestone Celebration',
        tagline: 'Honoring memories of the past while toasting to the best chapters ahead',
        decorIdeas: [
          'Multi-tiered organic balloon installations with integrated neon typography quote sign.',
          'Custom LED photo-moment tunnel featuring framed polaroid memories from each decade.',
          'Interactive champagne tower / signature cocktail mixology station with edible gold flakes.',
          'Customized velvet lounge seating clusters with ambient warm amber uplighting.'
        ],
        attireCode: 'Cocktail Chic / Glamorous Semi-Formal with a Splash of Color'
      };
    } else {
      // Community
      return {
        themeName: 'UnityFest: Vibrant Horizons & Community Spirit',
        tagline: 'Bridging cultures, celebrating local talent, and fostering lasting connections',
        decorIdeas: [
          'Colorful overhead canopy of geometric festive flags and solar-powered string lanterns.',
          'Interactive community art canvas wall where attendees stamp handprints or notes.',
          'Eco-friendly bamboo signage, upcycled wooden picnic tables, and recycling stations.',
          'Main stage framed with sustainable vertical green plant walls and dynamic LED banners.'
        ],
        attireCode: 'Casual, Comfortable & Festive Community Attire'
      };
    }
  }

  private static generateInvitations(request: EventRequest, themeName: string) {
    const formal = 
      `Together with their beloved families,\n` +
      `We cordially invite you to celebrate the joyous occasion of\n` +
      `"${request.title}"\n` +
      `Theme: ${themeName}\n` +
      `Date: ${request.targetDate} | Venue: ${request.location}\n` +
      `Kindly RSVP to facilitate our hospitality arrangements.`;

    const casual = 
      `Hey friends & family! 🎉 The big celebration is here!\n` +
      `Join us for ${request.title} on ${request.targetDate} at ${request.location}.\n` +
      `Expect fantastic food, music, dancing, and heartfelt memories.\n` +
      `Please let us know if you can make it by replying with your RSVP!`;

    const socialInvite = 
      `✨ SAVE THE DATE: ${request.title}! ✨\n` +
      `📅 ${request.targetDate} 📍 ${request.location}\n` +
      `We can't wait to celebrate this special milestone with all of you. DM us for full details & RSVP link! #CelebrateLife #${request.eventType}`;

    return { formal, casual, socialInvite };
  }

  private static generateSpeeches(request: EventRequest, themeName: string) {
    const welcomeSpeech = 
      `"Good evening, honored guests, cherished family, and dear friends! ` +
      `On behalf of everyone hosting today, welcome to ${request.title}. ` +
      `Looking out into this room in ${request.location}, seeing every smile and every familiar face, reminds us of the profound joy of bringing people together under our theme of '${themeName}'. ` +
      `Thank you for traveling near and far to share this milestone with us. Tonight is dedicated to joy, laughter, and creating memories we will reminisce about for years to come. Please enjoy the evening!"`;

    const hostToast = 
      `"Ladies and gentlemen, let us raise our glasses high! ` +
      `To life's priceless milestones, to the bonds of friendship and family that grow deeper with every passing year, ` +
      `and to the wonderful souls who made this day possible. May this celebration bring boundless happiness, health, and prosperity. Cheers!"`;

    const voteOfThanks = 
      `"As this unforgettable celebration draws to a close, my heart is overflowing with gratitude. ` +
      `First, to each and every guest—you gave this evening its energy, warmth, and soul. ` +
      `Second, to our phenomenal vendors, coordinators, caterers, and technical teams who worked tirelessly behind the scenes to turn our vision into reality. ` +
      `And finally, to our families whose constant love and sacrifices anchor us every single day. Wishing everyone safe travels home, and thank you from the bottom of our hearts!"`;

    return { welcomeSpeech, hostToast, voteOfThanks };
  }

  private static getPlaylistVibe(vibe: string): string[] {
    switch (vibe) {
      case 'royal_traditional':
        return [
          'Acoustic Sitar & Cello Ambient Symphony',
          'Classic Instrumental Wedding March in D Major',
          'Rich Sufi & Classical Ghazal Evening Melodies',
          'Celebratory Brass & Dhol High-Energy Finale'
        ];
      case 'bohemian_chic':
        return [
          'Indie Folk & Acoustic Guitar Harmonies',
          'Sunset Chill House & Tropical Lounge Beats',
          'Fleetwood Mac & Modern Folk Ballads',
          'Upbeat Feel-Good Indie Pop Anthems'
        ];
      case 'retro_vintage':
        return [
          'Frank Sinatra & Ella Fitzgerald Jazz Standards',
          'Vintage 70s Disco & Funk Dance Classics',
          'Motown Soul & Golden Groove Retrospectives',
          '80s Synthpop & Nostalgic Singalong Anthems'
        ];
      default:
        return [
          'Contemporary Feel-Good Acoustic Pop Covers',
          'Modern Upbeat Nu-Disco & Deep House Grooves',
          'Top 40 Dance Hits & Singalong Anthems',
          'Soulful Ballads & Euphoric Celebration Climax'
        ];
    }
  }
}
