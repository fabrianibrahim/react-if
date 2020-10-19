import React, { FC, ReactElement } from 'react';
import { Case } from './Case';
import { Default } from './Default';
import { getConditionResult } from './getConditionResults';

/**
 * It will render the first matching `<Case />`, or the first encountered `<Default />` (or `null`).
 *
 * This component can contain any number of `<Case />` and one `<Default />` blocks
 */
export const Switch: FC = ({ children }) => {
  // -- Inspired by react-router --

  // We use React.Children.forEach instead of React.Children.toArray().find()
  // here because toArray adds keys to all child elements and we do not want
  // to trigger an unmount/remount for two children <Case>s or <Default>s
  let matchingCase: ReactElement | undefined = undefined;
  let defaultCase: ReactElement | undefined = undefined;

  React.Children.forEach(children, child => {
    // not a valid react child, don't add it
    if (!React.isValidElement(child)) {
      return;
    }

    if (!matchingCase && child.type === Case) {
      const condition = child.props.condition;

      const conditionResult = getConditionResult(condition);

      if (conditionResult) {
        matchingCase = child;
      } // else not matching condition, don't add it
    } else if (!defaultCase && child.type === Default) {
      defaultCase = child;
    } // else unknown type, don't add it
  });

  return matchingCase ?? defaultCase ?? null;
};