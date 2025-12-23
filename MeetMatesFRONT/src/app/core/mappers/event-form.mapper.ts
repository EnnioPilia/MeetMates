// Core (models)
import { EventFormValue } from '../../core/models/event-form.model';
import { EventRequest } from '../../core/models/event-request.model';
import { EventDetails } from '../../core/models/event-details.model';

// utils
import { formatLocalDate } from '../../core/utils/date.utils';

/**
 * Mapper chargé de transformer les valeurs issues des formulaires d'événement
 * en objets de requête destinés à l'API, et inversement.
 *
 * Responsabilités :
 * - Adapter les valeurs du formulaire aux formats attendus par l'API
 * - Centraliser la logique de transformation formulaire ↔ modèle métier
 * - Garantir la cohérence des données (formats de dates, statuts autorisés)
 *
 * Ce mapper constitue une frontière explicite entre :
 * - la couche formulaire (UI / Reactive Forms)
 * - le contrat d'échange avec l'API
 */
export class EventFormMapper {

  /**
   * Transforme les valeurs d’un formulaire de création d’événement
   * en objet `EventRequest` destiné à l’API.
   *
   * Règles de mapping :
   * - la date est convertie au format local attendu par l'API
   * - le statut est forcé à `OPEN` lors de la création
   *
   * @param form Valeurs issues du formulaire
   * @returns Objet `EventRequest` prêt à être envoyé à l’API
   */
  static toCreateRequest(form: EventFormValue): EventRequest {
    return {
      title: form.title,
      description: form.description,
      eventDate: formatLocalDate(form.eventDate),
      startTime: form.startTime,
      endTime: form.endTime,
      maxParticipants: form.maxParticipants,
      material: form.material,
      level: form.level,
      activityId: form.activityId,
      address: form.address,
      status: 'OPEN',
    };
  }
  
  /**
   * Transforme les valeurs d’un formulaire de modification d’événement
   * en objet `EventRequest` destiné à l’API.
   *
   * Règles de mapping :
   * - la date est convertie au format local attendu par l'API
   * - le statut issu du formulaire est utilisé s’il est présent
   * - sinon, le statut existant est conservé
   *
   * @param form Valeurs issues du formulaire
   * @param existingStatus Statut actuellement enregistré côté API
   * @returns Objet `EventRequest` prêt à être envoyé à l’API
   */
  static toUpdateRequest(
    form: EventFormValue,
    existingStatus: EventRequest['status']
  ): EventRequest {
    return {
      title: form.title,
      description: form.description,
      eventDate: formatLocalDate(form.eventDate),
      startTime: form.startTime,
      endTime: form.endTime,
      maxParticipants: form.maxParticipants,
      material: form.material,
      level: form.level,
      activityId: form.activityId,
      address: form.address,
      status: form.status ?? existingStatus,
    };
  }

  /**
   * Transforme un modèle `EventDetails` issu de l’API
   * en valeurs compatibles avec le formulaire d’édition.
   *
   * Règles de mapping :
   * - la date string (YYYY-MM-DD) est convertie en objet `Date`
   * - seuls les statuts autorisés sont propagés au formulaire
   * - un statut non reconnu est ignoré
   *
   * @param event Modèle détaillé d’un événement
   * @returns Valeurs prêtes à être injectées dans un formulaire
   */
  static toFormValue(event: EventDetails): EventFormValue {

    const allowedStatuses = ['OPEN', 'FULL', 'CANCELLED', 'FINISHED',] as const;

    type AllowedStatus = typeof allowedStatuses[number];

    const status = allowedStatuses.includes(event.status as AllowedStatus)
      ? (event.status as AllowedStatus) : undefined;

    const [year, month, day] = event.eventDate.split('-').map(Number);

    return {
      title: event.title,
      description: event.description,
      eventDate: new Date(year, month - 1, day),
      startTime: event.startTime,
      endTime: event.endTime,
      maxParticipants: event.maxParticipants,
      material: event.material,
      level: event.level,
      activityId: event.activityId ?? '',
      address: event.address,
      status,
    };
  }
}
