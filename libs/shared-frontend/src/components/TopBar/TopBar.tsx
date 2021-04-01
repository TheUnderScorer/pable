import { Badge, Button, ButtonGroup, Heading, HStack } from '@chakra-ui/react';
import React from 'react';
import { clientRoutes } from '../../clientRoutes';
import { Link, useLocation } from 'react-router-dom';

const routes = [
  {
    href: clientRoutes.langTable,
    label: 'Table',
  },
  {
    href: clientRoutes.translateDocument,
    label: 'Translate document',
    new: true,
  },
];

export const TopBar = () => {
  const location = useLocation();

  return (
    <HStack className="app-topbar" ml={4} p={2} spacing={8}>
      <Link to={clientRoutes.langTable}>
        <Heading id="title" textAlign="center">
          Skryba 2.0{' '}
          <span role="img" aria-label="Hand write">
            ✍️
          </span>
        </Heading>
      </Link>
      <ButtonGroup alignItems="center" spacing={4} variant="link">
        {routes.map((route) => {
          const isCurrentRoute = location.pathname === route.href;
          return (
            <Link to={route.href} key={route.href}>
              <Button
                textDecoration="none !important"
                boxShadow="none !important"
                borderRadius={0}
                pb={2}
                borderBottomStyle="solid"
                borderBottomWidth="2px"
                borderBottomColor={isCurrentRoute ? 'primary' : 'transparent'}
              >
                {route.label}
              </Button>
              {route.new && (
                <Badge colorScheme="primaryScheme" ml={2}>
                  New
                </Badge>
              )}
            </Link>
          );
        })}
      </ButtonGroup>
    </HStack>
  );
};
